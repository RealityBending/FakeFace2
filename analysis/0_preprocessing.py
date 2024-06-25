import json

import numpy as np
import pandas as pd


# Get files from OSF ======================================================
def osf_listfiles(data_subproject="", token="", after_date=None):
    """Function to connect and access files from an OSF project."""
    try:
        import osfclient
    except ImportError:
        raise ImportError("Please install 'osfclient' (`pip install osfclient`)")
    osf = osfclient.OSF(token=token).project(data_subproject)  # Connect to project
    storage = [s for s in osf.storages][0]  # Access storage component
    files = [
        {
            "name": file.name.replace(".csv", ""),
            "date": pd.to_datetime(file.date_created),
            "url": file._download_url,
            "size": file.size,
            "file": file,
        }
        for file in storage.files
    ]

    if after_date is not None:
        date = pd.to_datetime(after_date, format="%d/%m/%Y", utc=True)
        files = [f for f, d in zip(files, [f["date"] > date for f in files]) if d]
    return files


# Connect to OSF and get files --------------------------------------------
token = ""  # Paste OSF token here to access private repositories
files = osf_listfiles(
    token=token,
    data_subproject="s3kyn",  # Data subproject ID
    after_date="19/01/2024",
)

# Loop through files ======================================================
# Initialize empty dataframes
alldata = pd.DataFrame()

for i, file in enumerate(files):
    print(f"File N°{i+1}/{len(files)}")

    if "Participant" in alldata.columns and file["name"] in alldata["Participant"].values:
        continue

    download_ok = False
    while download_ok == False:
        data = pd.read_csv(file["file"]._get(file["url"], stream=True).raw)
        if len(data) > 0:
            download_ok = True

    # Participant ----------------------------------------------------------
    data["screen"].unique()

    # Browser info -------------------------------------------------------
    browser = data[data["screen"] == "browser_info"].iloc[0]

    df = pd.DataFrame(
        {
            "Participant": file["name"],
            "Experiment_Duration": data["time_elapsed"].max() / 1000 / 60,
            "Date_OSF": file["date"],
            "Date": browser["date"],
            "Time": browser["time"],
            "Browser": browser["browser"],
            "Mobile": browser["mobile"],
            "Platform": browser["os"],
            "Screen_Width": browser["screen_width"],
            "Screen_Height": browser["screen_height"],
        },
        index=[0],
    )

    # Demographics -------------------------------------------------------
    demo1 = data[data["screen"] == "demographics_1"].iloc[0]
    demo1 = json.loads(demo1["response"])

    df["Gender"] = demo1["gender"]

    # Education
    edu = demo1["education"]
    edu = "Bachelor" if "bachelor" in edu else edu
    edu = "Master" if "master" in edu else edu
    edu = "Doctorate" if "doctorate" in edu else edu
    edu = "High School" if "High school" in edu else edu
    df["Education"] = edu

    # IPIP6 ----------------------------------------------------------------
    ipip = data[data["screen"] == "IPIP6"].iloc[0]

    df["IPIP6_Duration"] = ipip["rt"] / 1000 / 60
    ipip = json.loads(ipip["response"])
    for item in ipip:
        df["IPIP6_" + item] = float(ipip[item])

    ipip = json.loads(ipip["response"])


    # Concatenate data ------------------------------------------------------
    alldata = pd.concat([alldata, df], axis=0, ignore_index=True)
    
# Save data ==============================================================

alldata.to_csv("../data/rawdata.csv", index=False)
