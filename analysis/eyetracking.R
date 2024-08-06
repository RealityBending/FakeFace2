library(tidyverse)
library(easystats)
library(patchwork)
library(magick)




# Validation --------------------------------------------------------------

dfval <- read.csv("../data/rawdata_participants.csv") |>
  select(Participant, starts_with("Eyetracking_")) |>
  pivot_longer(-Participant, names_to="Index", values_to="Value") |>
  filter(!is.na(Value)) |>
  filter(str_detect(Index, "_Mean")) |>
  mutate(Participant = fct_reorder(Participant, Value))

dfval |>
  ggplot(aes(x=Value, y=Participant)) +
  geom_bar(stat="identity", aes(fill=Index), position = position_dodge()) +
  theme_minimal()


# Fixation Cross ----------------------------------------------------------

df <- read.csv("../data/rawdata_eyetracking.csv") |>
  full_join(select(read.csv("../data/rawdata_task.csv"), Participant, Stimulus, Condition),
            by = join_by(Participant, Stimulus))  |>
  mutate(
    Participant = fct_relevel(Participant, rev(levels(dfval$Participant))),
    Condition = fct_relevel(Condition, c("Reality", "Fiction")),
    # Rescale Gaze_x as a percentage where 0 is the left corner and 1 is the right corner
    x = (Gaze_x - Target_TopLeft_x) / (Target_BottomRight_x - Target_TopLeft_x),
    y = (Gaze_y - Target_TopLeft_y) / (Target_BottomRight_y - Target_TopLeft_y),
    # Distance from center (0, 0)
    distance = sqrt(x^2 + y^2)
  )




p_all <- df |>
  filter(Type == "Fixation Cross") |>
  mutate(
    x = Gaze_x / (Target_TopLeft_x * 2),
    y = Gaze_y / (Target_TopLeft_y * 2)
  ) |>
  ggplot(aes(x=x, y=y)) +
  geom_path(aes(group=interaction(Participant, Stimulus), color=Participant, linewidth=Time)) +
  geom_hline(yintercept = 0.5, linetype="dashed", color="black") +
  geom_vline(xintercept = 0.5, linetype="dashed", color="black") +
  see::scale_color_material_d(guide="none") +
  scale_linewidth_continuous(range=c(1, 0.1), guide="none") +
  scale_x_continuous(labels=scales::percent) +
  scale_y_continuous(labels=scales::percent) +
  theme_minimal()

p_ppt <- p_all +
  facet_wrap(~Participant)

(p_all ) | p_ppt


# Outliers ----------------------------------------------------------------


invalid <- df |>
  summarize(xout = mean((x < 0) | (x > 1)),
            yout = mean((y < 0) | (y > 1)),
            .by=c("Participant", "Stimulus")) |>
  mutate(Bad = case_when(
    is.na(xout) | is.na(yout) ~ TRUE,
    xout > 0.9 | yout > 0.9 ~ TRUE,
    .default = FALSE
  ))


invalid |>
  summarize(Bad = sum(Bad) / n(),
            .by=c("Participant")) |>
  mutate(Participant = fct_reorder(Participant, Bad)) |>
  ggplot(aes(y=Participant, x=Bad)) +
  geom_bar(stat="identity", aes(fill=Participant)) +
  scale_x_continuous(labels=scales::percent) +
  theme_minimal() +
  theme(legend.position="none")


df <- df |>
  full_join(select(invalid, Participant, Stimulus, Bad), by=join_by(Participant, Stimulus)) |>
  filter(Bad == FALSE) |>
  select(-Bad)

# Per Stimulus ------------------------------------------------------------

plot_eyetrace <- function(stim="NF-1041") {
  img <- magick::image_read(paste0("../experiment/stimuli/AMFD/", stim, ".jpg")) |>
    magick::image_resize("300x")

  dat <- df |>
    filter(Type == "Image") |>
    filter(Stimulus == stim) |>
    mutate(
      x = datawizard::rescale(x, range=c(0, 1), to=c(0, magick::image_info(img)$width)),
      y = datawizard::rescale(y, range=c(0, 1), to=c(0, magick::image_info(img)$height))
    )

  img |>
    magick::image_ggplot()  +
    stat_density_2d(
      data=dat,
      aes(x=x, y=y, fill = ..level..),
      geom = "polygon", alpha=0.1) +
    geom_path(
      data=dat,
      aes(x=x, y=y, group = Participant, color=Condition),
      alpha=0.3) +
    scale_color_manual(values=c("Reality"="red", "Fiction"="blue")) +
    scale_fill_gradientn(colors=c("blue", "green", "yellow", "orange", "red")) +
    labs(title=stim) +
    theme_void() +
    theme(legend.position="none",
          strip.text = element_blank())  +
    facet_grid(~Condition)
}

plots <- list()
for (stim in unique(df$Stimulus)[1:40]) {
  plots[[stim]] <- plot_eyetrace(stim)
}
patchwork::wrap_plots(plots, ncol=4)



# Analysis ----------------------------------------------------------------
dat <- filter(df, is.finite(distance))

estimate_density(dat$distance, by=dat$Condition) |>
  ggplot(aes(x=x, y=y, color=Group)) +
  geom_line()


m <- glmmTMB::glmmTMB(distance ~ Condition + (1|Participant) + (Condition|Stimulus),
                      data=dat)
parameters::parameters(m)

estimate_means(m, by="Condition") |>
  ggplot(aes(x=Condition)) +
  ggdist::stat_slab(data=filter(dat, Condition=="Reality"), aes(y=distance, fill=Condition), side="left") +
  ggdist::stat_slab(data=filter(dat, Condition=="Fiction"), aes(y=distance, fill=Condition), side="right") +
  geom_line(aes(y=Mean, group=1)) +
  geom_pointrange(aes(y=Mean, ymin=CI_low, ymax=CI_high)) +
  theme_minimal() +
  labs(y="Distance from center", x="Condition")


