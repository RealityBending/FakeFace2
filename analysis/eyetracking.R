library(tidyverse)
library(easystats)
library(magick)

read.csv("../data/rawdata_participants.csv") |>
  select(Participant, starts_with("Eyetracking_"))


df <- read.csv("../data/rawdata_eyetracking.csv") |>
  mutate(
    # Rescale Gaze_x as a percentage where 0 is the left corner and 1 is the right corner
    x = (Gaze_x - Target_TopLeft_x) / (Target_BottomRight_x - Target_TopLeft_x),
    y = (Gaze_y - Target_TopLeft_y) / (Target_BottomRight_y - Target_TopLeft_y)
  )


df |>
  filter(Type == "Fixation Cross") |>
  mutate(
    x = Gaze_x / (Target_TopLeft_x * 2),
    y = Gaze_y / (Target_TopLeft_y * 2)
  ) |>
  ggplot(aes(x=x, y=y)) +
  geom_path(aes(group=interaction(Participant, Stimulus), color=Stimulus, linewidth=Time)) +
  geom_hline(yintercept = 0.5, linetype="dashed", color="black") +
  geom_vline(xintercept = 0.5, linetype="dashed", color="black") +
  see::scale_color_material_d(guide="none") +
  scale_linewidth_continuous(range=c(1, 0.1), guide="none") +
  theme_minimal()




# Per Stimulus ------------------------------------------------------------

stim <- "NF-1041"

img <- magick::image_read(paste0("../experiment/stimuli/AMFD/", stim, ".jpg")) |>
  magick::image_resize("1000x")

dat <- df |>
  filter(Type != "Fixation Cross") |>
  filter(Stimulus == stim) |>
  mutate(
    x = datawizard::rescale(x, range=c(0, 1), to=c(0, magick::image_info(img)$width)),
    y = datawizard::rescale(y, range=c(0, 1), to=c(0, magick::image_info(img)$height))
  )

img |>
  magick::image_ggplot()  +
  geom_path(
    data=dat,
    aes(x = x, y=y, group = Participant, color=Participant)) +
  theme_minimal()
