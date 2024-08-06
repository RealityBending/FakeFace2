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
    after_date="21/07/2024",
)

# Loop through files ======================================================
# Initialize empty dataframes
data_demo = pd.DataFrame()
data_task = pd.DataFrame()
data_eye = pd.DataFrame()

for i, file in enumerate(files):
    print(f"File N°{i+1}/{len(files)}")  # Print progress

    # Skip if participant already in the dataset
    if (
        "Participant" in data_demo.columns
        and file["name"] in data_demo["Participant"].values
    ):
        continue

    data = osf_download(file)  # Function in the data_OSF.py script loaded above

    # Participant ----------------------------------------------------------
    data["screen"].unique()

    # Browser info -------------------------------------------------------
    browser = data[data["screen"] == "browser_info"].iloc[0]

    # Skip
    if browser["researcher"] == "test":
        continue

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
            "Source": browser["researcher"],
        },
        index=[0],
    )

    # Demographics -------------------------------------------------------
    demo = data[data["screen"] == "demographic_questions"].iloc[0]
    demo = json.loads(demo["response"])

    for item in demo:
        df[item] = demo[item]

    # HEXACO ----------------------------------------------------------------
    hexaco = data[data["screen"] == "questionnaire_hexaco18"].iloc[0]

    df["Hexaco_Duration"] = hexaco["rt"] / 1000 / 60
    hexaco = json.loads(hexaco["response"])
    for item in hexaco:
        df[item] = float(hexaco[item])

    # BAIT ------------------------------------------------------------------
    bait = data[data["screen"] == "questionnaire_bait"].iloc[0]

    df["Bait_Duration"] = bait["rt"] / 1000 / 60
    bait = json.loads(bait["response"])
    for item in bait:
        df[item] = float(bait[item])

    # Task data -----------------------------------------------------------
    df["Instruction_Duration1"] = (
        data[data["screen"] == "fiction_instructions1"].iloc[0]["rt"] / 1000
    )
    df["Instruction_Duration2"] = (
        data[data["screen"] == "fiction_instructions2"].iloc[0]["rt"] / 1000
    )

    # Phase 1
    stims1 = data[data["screen"] == "fiction_image1"].copy()
    ratings1 = data[data["screen"] == "fiction_ratings1"].copy()
    cues = data[data["screen"] == "fiction_cue"].copy()

    dftask = pd.DataFrame(
        {
            "Participant": file["name"],
            "Stimulus": stims1["stimulus"],
            "Trial_Order_Phase1": stims1["trial_number"],
            "Trial_Duration_Phase1": stims1["trial_duration"] / 1000,
            "Rating_RT_Phase1": ratings1["rt"].values,
            "Cue_Color": cues["color"].values,
            "Condition": cues["condition"].values,
        }
    )

    ratings1 = [json.loads(k) for k in ratings1["response"]]
    dftask["Beauty"] = [r["Beauty"] for r in ratings1]
    dftask["Attractiveness"] = [r["Attractiveness"] for r in ratings1]
    dftask["Trustworthiness"] = [r["Trustworthiness"] for r in ratings1]

    # Phase 2
    stims2 = data[data["screen"] == "fiction_image2"].copy()
    ratings2 = data[data["screen"] == "fiction_ratings2"].copy()

    dftask2 = pd.DataFrame(
        {
            "Stimulus": stims2["stimulus"],
            "Trial_Order_Phase2": stims2["trial_number"],
            "Trial_Duration_Phase2": stims2["trial_duration"] / 1000,
            "Rating_RT_Phase2": ratings2["rt"].values,
        }
    )

    ratings2 = [json.loads(k) for k in ratings2["response"]]
    dftask2["Realness"] = [r["Realness"] for r in ratings2]

    # Merge and clean
    dftask = pd.merge(dftask, dftask2, on="Stimulus", how="left")
    dftask["Stimulus"] = dftask["Stimulus"].apply(
        lambda x: x.replace("stimuli/AMFD/", "")
    )
    dftask["Stimulus"] = dftask["Stimulus"].apply(lambda x: x.replace(".jpg", ""))
    dftask = dftask.reset_index(drop=True)

    data_task = pd.concat([data_task, dftask], axis=0, ignore_index=True)

    # Eye-tracking data --------------------------------------------------
    if "eyetracking_validation_run" in data["screen"].values:
        eye = data[data["screen"] == "eyetracking_validation_run"]
        calib = [json.loads(k) for k in eye["percent_in_roi"]]
        dist = [json.loads(k) for k in eye["average_offset"]]

        df["Eyetracking_Validation1_Mean"] = np.mean(calib[-2])
        df["Eyetracking_Validation1_Max"] = np.max(calib[-2])
        df["Eyetracking_Validation1_Min"] = np.min(calib[-2])
        # The average x and y distance from each validation point, plus the median
        # distance r of the points from this average offset.
        df["Eyetracking_Validation1_Distance"] = np.mean([g["r"] for g in dist[-2]])

        df["Eyetracking_Validation2_Mean"] = np.mean(calib[-1])
        df["Eyetracking_Validation2_Max"] = np.max(calib[-1])
        df["Eyetracking_Validation2_Min"] = np.min(calib[-1])
        df["Eyetracking_Validation2_Distance"] = np.mean([g["r"] for g in dist[-1]])

        stims = data[data["screen"] == "fiction_image1"].copy().reset_index(drop=True)
        for j, row in stims.iterrows():
            item = row["stimulus"].replace("stimuli/AMFD/", "")
            gaze = json.loads(row["webgazer_data"])
            dfgaze = pd.DataFrame(
                {
                    "Participant": file["name"],
                    "Stimulus": item.replace(".jpg", ""),
                    "Trial": row["trial_number"],
                    "Time": [g["t"] / 1000 for g in gaze],
                    "Gaze_x": [g["x"] for g in gaze],
                    "Gaze_y": [g["y"] for g in gaze],
                    "Type": "Image",
                }
            )

            # Contain x and y properties specifying the top-left corner of the object, width and height values,
            # plus top, bottom, left, and right parameters which specify the bounding rectangle of the element.
            target = json.loads(row["webgazer_targets"])[
                "#jspsych-image-keyboard-response-stimulus"
            ]
            dfgaze["Target_TopLeft_x"] = target["x"]
            dfgaze["Target_TopLeft_y"] = target["y"]
            dfgaze["Target_BottomRight_x"] = target["x"] + target["width"]
            dfgaze["Target_BottomRight_y"] = target["y"] + target["height"]

            # Fixation cross
            fixcross = data[
                (data["screen"] == "fiction_fixation1b") & (data["item"] == item)
            ]

            target = json.loads(fixcross["webgazer_targets"].values[0])[
                "#jspsych-html-keyboard-response-stimulus"
            ]

            fixcross = json.loads(fixcross["webgazer_data"].values[0])

            dfgazefixcross = pd.DataFrame(
                {
                    "Participant": file["name"],
                    "Stimulus": item.replace(".jpg", ""),
                    "Trial": row["trial_number"],
                    "Time": [g["t"] / 1000 for g in fixcross],
                    "Gaze_x": [g["x"] for g in fixcross],
                    "Gaze_y": [g["y"] for g in fixcross],
                    "Type": "Fixation Cross",
                    "Target_TopLeft_x": target["x"],
                    "Target_TopLeft_y": target["y"],
                    "Target_BottomRight_x": target["x"] + target["width"],
                    "Target_BottomRight_y": target["y"] + target["height"],
                }
            )

            dfgaze = pd.concat([dfgazefixcross, dfgaze], axis=0, ignore_index=True)
            data_eye = pd.concat([data_eye, dfgaze], axis=0, ignore_index=True)

    # Concatenate data ------------------------------------------------------
    data_demo = pd.concat([data_demo, df], axis=0, ignore_index=True)


# Reanonimize =============================================================
data_demo = data_demo.sort_values(["Date_OSF"])
ppt = {s: f"S{i+1:03d}" for i, s in enumerate(data_demo["Participant"].unique())}
data_demo["Participant"] = [ppt[s] for s in data_demo["Participant"]]
data_task["Participant"] = [ppt[s] for s in data_task["Participant"]]
data_eye["Participant"] = [ppt[s] for s in data_eye["Participant"]]

# Save data ==============================================================

data_demo.to_csv("../data/rawdata_participants.csv", index=False)
data_task.to_csv("../data/rawdata_task.csv", index=False)
data_eye.to_csv("../data/rawdata_eyetracking.csv", index=False)
