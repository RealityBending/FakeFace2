library(jsonlite)

#path for data
path <- "C:/Users/asf25/Box/FakeFace2/"

#jsPsych experiment ------------------------------------------------------------

files <- list.files(path, pattern = "*.csv")

#create empty dataframe
demo_data <-data.frame()


for (file in files) {
  rawdata <- read.csv(paste0(path, "/", file))
  
  #create participant name from file name
  filename = sub("\\.csv$", "", basename(file))

  #Initialise participant-level data
  dat <- rawdata[rawdata$screen == "browser_info",]
  
  data_ppt <- data.frame(
    Participant = filename,
    Recruitment = dat$researcher, 
    Experiment_StartDate = as.POSIXct(paste(dat$date, dat$time), format = "%d/%m/%Y %H:%M:%S"),
    Experiment_Duration = rawdata[rawdata$screen == "demographics_debrief", "time_elapsed"] / 1000 / 60,
    Browswer = dat$browser,
    Mobile = dat$mobile,
    Platform = dat$os,
    Screen_Width = dat$screen_width,
    Screen_Height = dat$screen_height,
  )
  
  #demographics
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
  data_ppt$FaceAttractiveness <- ifelse(fiction_feedback$Feedback_1 == "other", fiction_feedback$`Feedback_1-Comment`, fiction_feedback$Feedback_1)
  data_ppt$AI_Algorithm <- ifelse(fiction_feedback$Feedback_2 == "other", fiction_feedback$`Feedback_1-Comment`, fiction_feedback$Feedback_1)
  
  # General Feedback 
  feedback <- jsonlite::fromJSON(rawdata[rawdata$screen == "experiment_feedback", "response"])
  data_ppt$Experiment_Enjoyment <- ifelse(is.null(feedback$Feedback_Enjoyment), NA, feedback$Feedback_Enjoyment)
  data_ppt$Experiment_Feedback <- ifelse(is.null(feedback$Feedback_Text), NA, feedback$Feedback_Text)
  
  # Questionnaire
  
}
