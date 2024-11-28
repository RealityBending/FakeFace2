library(jsonlite)

#path for data
path <- "C:/Users/asf25/Box/FakeFace2/"

#jsPsych experiment ------------------------------------------------------------

files <- list.files(path, pattern = "*.csv")

#create empty dataframe
demo_data <- data.frame()


for (file in files) {
  rawdata <- read.csv(paste0(path, "/", file))
  
  #create participant name from file name
  filename <- sub("\\.csv$", "", basename(file))

  #Initialise participant-level data
  dat <- rawdata[rawdata$screen == "browser_info",]
  
  data_ppt <- data.frame(
    Participant = filename,
    Recruitment = dat$researcher, 
    Experiment_StartDate = as.POSIXct(paste(dat$date, dat$time), format = "%d/%m/%Y %H:%M:%S"),
    #Experiment_Duration = rawdata[rawdata$screen == "demographics_debrief", "time_elapsed"] / 1000 / 60,
    Browswer = dat$browser,
    Mobile = dat$mobile,
    Platform = dat$os,
    Screen_Width = dat$screen_width,
    Screen_Height = dat$screen_height)
  
  # Demographics
  demog <- jsonlite::fromJSON(rawdata[rawdata$screen == "demographic_questions", ]$response)
  
  demog$Education <- ifelse(demog$Education == "other", demog$`Education-Comment`, demog$Education)
  demog$`Education-Comment` <- NULL
  demog$Discipline <- ifelse(demog$Discipline == "other", demog$`Discipline-Comment`, demog$Discipline)
  demog$`Discipline-Comment` <- NULL
  demog$Discipline <- ifelse(!is.null(demog$Discipline), demog$Discipline, NA)
  demog$Student <- ifelse(!is.null(demog$Student), demog$Student, NA)
  demog$Ethnicity <- ifelse(demog$Ethnicity == "other", demog$`Ethnicity-Comment`, demog$Ethnicity)
  demog$`Ethnicity-Comment` <- NULL
  
  demo <- jsonlite::fromJSON(rawdata[rawdata$screen == "demographic_questions", "response"])
  demo <- as.data.frame(t(demo))
  
  demo$Education <- ifelse(demo$Education == "other", demo$`Education-Comment`, demog$Education)
  demo$`Education-Comment`<- NULL
  data_ppt <- cbind(data_ppt, demo)
  
  # Feedback phase 1
  fiction_feedback <- jsonlite::fromJSON(rawdata[rawdata$screen == "fiction_feedback1", "response"])
  
  #Face attractiveness
  data_ppt$NoFacesAttractive <- any(fiction_feedback$Feedback_1 == "No face was particularly attractive")
  data_ppt$SomeFacesAttractive <- any(fiction_feedback$Feedback_1 == "Some faces were really attractive")
  data_ppt$AIMoreAttractive <- any(fiction_feedback$Feedback_1 == "AI-generated images were more attractive than the photos")
  data_ppt$AILessAttractive <- any(fiction_feedback$Feedback_1 == "AI-generated images were less attractive than the photos")
  data_ppt$OtherAttractiveness <- ifelse(fiction_feedback$Feedback_1 == "other",fiction_feedback$`Feedback_1-Comment`, NA)
    
  #AI-Generation Algorithm
  data_ppt$DiffObvious <- any(fiction_feedback$Feedback_2 == "The difference between the photos and the AI-generated images was obvious")
  data_ppt$DiffSubtle <- any(fiction_feedback$Feedback_2 == "The difference between the photos and the AI-generated images was subtle")
  data_ppt$DiffNone <- any(fiction_feedback$Feedback_2 == "I didn't see any difference between photos and AI-generated images")
  data_ppt$Diff_LabelsIncorrect <- any(fiction_feedback$Feedback_2 == "I felt like the labels ('Photograph' and 'AI-Generated') were not always correct")
  data_ppt$Diff_LabelsReversed <- any(fiction_feedback$Feedback_2 == "I felt like the labels were reversed (e.g., 'Photograph' for AI-generated images and vice versa)")
  data_ppt$AllReal <- any(fiction_feedback$Feedback_2 == "I feel like all the images were photos")
  data_ppt$AllFake <- any(fiction_feedback$Feedback_2 == "I feel like all the images were AI-generated")
  data_ppt$OtherAI <- ifelse(any(fiction_feedback$Feedback_2 == "other"), fiction_feedback$`Feedback_2-Comment`, NA)
  
  #Confidence
  data_ppt$AllReal_Confidence <- ifelse(!is.null(fiction_feedback$Feedback_2_ConfidenceReal), fiction_feedback$Feedback_2_ConfidenceReal, NA)
  data_ppt$AllFake_Confidence <- ifelse(!is.null(fiction_feedback$Feedback_2_ConfidenceFake), fiction_feedback$Feedback_2_ConfidenceFake, NA) 
  
  # General Feedback 
  feedback <- jsonlite::fromJSON(rawdata[rawdata$screen == "experiment_feedback", "response"])
  data_ppt$Experiment_Enjoyment <- ifelse(is.null(feedback$Feedback_Enjoyment), NA, feedback$Feedback_Enjoyment)
  data_ppt$Experiment_Feedback <- ifelse(is.null(feedback$Feedback_Text), NA, feedback$Feedback_Text)
  
  demo_data <- rbind(data_ppt, demo_data)
}
