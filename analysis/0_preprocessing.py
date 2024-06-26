import json

import numpy as np
import pandas as pd

import requests

# Load useful functions
exec(
    requests.get(
        "https://raw.githubusercontent.com/RealityBending/scripts/main/data_OSF.py"
    ).text
)

# Connect to OSF and get files --------------------------------------------
token = ""  # Paste OSF token here to access private repositories
files = osf_listfiles(  # Function in the data_OSF.py script loaded above
    token=token,
    data_subproject="s3kyn",  # Data subproject ID
    after_date="19/01/2024",
)

# Loop through files ======================================================
# Initialize empty dataframes
alldata = pd.DataFrame()
alltask = pd.DataFrame()

for i, file in enumerate(files):
    print(f"File N°{i+1}/{len(files)}")  # Print progress

    # Skip if participant already in the dataset
    if (
        "Participant" in alldata.columns
        and file["name"] in alldata["Participant"].values
    ):
        continue

    data = osf_download(file)  # Function in the data_OSF.py script loaded above

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

    # Task data -----------------------------------------------------------
    stims = data[data["screen"] == "fiction_image1"].copy()

    # Concatenate data ------------------------------------------------------
    alldata = pd.concat([alldata, df], axis=0, ignore_index=True)

# Save data ==============================================================

alldata.to_csv("../data/rawdata.csv", index=False)
