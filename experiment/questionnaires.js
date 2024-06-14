// FaceFake2 questionnaires

// Questionnaires =================================================

function format_questions_analog(items, dimensions, ticks = ["Inaccurate", "Accurate"]) {
    var questions = []
    for (const [index, element] of items.entries()) {
        questions.push({
            prompt: "<b>" + element + "</b>",
            name: dimensions[index],
            ticks: ticks,
            required: false,
            min: 0,
            max: 1,
            step: 0.01,
            slider_start: 0.5,
        })
    }
    return questions
}

// Mini IPIP scale
var IPIP = [
    "<b>I am the life of the party</b><br>",
    "<b>I sympathize with others' feelings</b><br>",
    "<b>I get chores done right away</b><br>",
    "<b>I have frequent mood swings</b><br>",
    "<b>I have a vivid imagination</b><br>",
    "<b>I feel entitled to more of everything</b><br>",
    "<b>I do not talk a lot</b><br>",
    "<b>I am not interested in other people's problems</b><br>",
    "<b>I have difficulty understanding abstract ideas</b><br>",
    "<b>I like order</b><br>",
    "<b>I make a mess of things</b><br>",
    "<b>I deserve more things in life</b><br>",
    "<b>I do not have a good imagination</b><br>",
    "<b>I feel other's emotions</b><br>",
    "<b>I am relaxed most of the time</b><br>",
    "<b>I get upset easily</b><br>",
    "<b>I seldom feel blue</b><br>",
    "<b>I would like to be seen driving around in a very expensive car</b><br>",
    "<b>I keep in the background</b><br>",
    "<b>I am not really interested in others</b><br>",
    "<b>I am not interested in abstract ideas</b><br>",
    "<b>I often forget to put things back in their proper place</b><br>",
    "<b>I talk to a lot of different people at parties</b><br>",
    "<b>I would get a lot of pleasure from owning expensive luxury goods</b><br>",
]

var IPIP_dim = [
    "Extraversion_1",
    "Agreeableness_2",
    "Conscientiousness_3",
    "Neuroticism_4",
    "Openness_5",
    "HonestyHumility_6_R",
    "Extraversion_7_R",
    "Agreeableness_8_R",
    "Openness_9_R",
    "Conscientiousness_10",
    "Conscientiousness_11_R",
    "HonestyHumility_12_R",
    "Openness_13_R",
    "Agreeableness_14",
    "Neuroticism_15_R",
    "Neuroticism_16",
    "Neuroticism_17_R",
    "HonestyHumility_18_R",
    "Extraversion_19_R",
    "Agreeableness_20_R",
    "Openness_21_R",
    "Conscientiousness_22_R",
    "Extraversion_23",
    "HonestyHumility_24_R",
]
