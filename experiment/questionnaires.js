// FaceFake2 questionnaires
var questionnaires_instructions0 = {
            type: jsPsychHtmlButtonResponse,
            stimulus:
                "<h1>Part 2/4</h1>" +
                "<p>Great! We will continue with a series of questionnaires about your personality.<br>Again, it is important that you answer truthfully. Please read the statements carefully and answer according to what describe you the best.</p>",
            choices: ["Continue"],
            data: { screen: "instructions0" },
        }

// Questionnaires =================================================        
/* Measures */ //===============================================================
// Scale Labels
var scale1 = ["Not at All", "Extremely"]
var scale2 = ["Strongly Disagree", "Strongly Agree"]

// mini-ipip
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
    
    /* Mini IPIP *==========================*/
    var IPIP_items = []
        for (const [index, element] of IPIP.entries()) {
            IPIP_items.push({
                prompt: element,
                name: IPIP_dim[index],
                ticks: scale2,
                required: true,
                min: 0,
                max: 1,
                step: 0.01,
                slider_start: 0.5
            })
        }
        
        var IPIP6 = {
            type: jsPsychMultipleSlider,
            questions: IPIP_items,
            randomize_question_order: false,
            preamble:
                "<p><b>Survey 1/2</b></b></p>" +
                "<p>Please answer the following questions based on how accurately each statement describes you.</p>",
            require_movement: true,
            on_start: function () {
                ; (document.body.style.cursor = "auto"),
                    (document.querySelector(
                        "#jspsych-progressbar-container"
                    ).style.display = "inline")
            },
            data: {
                screen: "IPIP6",
            },
        }

// HEX-ACO-18
// Olaru, G., & Jankowsky, K. (2022). The HEX-ACO-18: Developing an age-invariant HEXACO short scale using ant colony optimization. Journal of Personality Assessment, 104(4), 435-446.
// A selection of HEXACO items using a new methodology to develop a short scale that is invariant across age groups.
const hexaco18_items = [
    "I wouldn't pretend to like someone just to get that person to do favors for me.",
    "I would like to be seen driving around in a very expensive car.", // Reversed
    "I want people to know that I am an important person of high status.", // Reversed
    "Even in an emergency I wouldn't feel like panicking.", // Reversed
    "When I suffer from a painful experience, I need someone to make me feel comfortable.",
    "I sometimes can't help worrying about little things.",
    "I feel that I am an unpopular person.", // Reversed
    "I rarely express my opinions in group meetings.", // Reversed
    "Most people are more upbeat and dynamic than I generally am.", // Reversed
    "I rarely hold a grudge, even against people who have badly wronged me.",
    "I generally accept people's faults without complaining about them.",
    "I find it hard to keep my temper when people insult me.", // Reversed
    "Often when I set a goal, I end up quitting without having reached it.", // Reversed
    "I make a lot of mistakes because I don't think before I act.", // Reversed
    "When working, I sometimes have difficulties due to being disorganized.", // Reversed
    "I think that paying attention to radical ideas is a waste of time.", // Reversed
    "If I had the opportunity, I would like to attend a classical music concert.",
    "I would enjoy creating a work of art, such as a novel, a song, or a painting.",
]

const hexaco18_dimensions = [
    "HEXACO18_HonestyHumility_Sincerity_1_NR",
    "HEXACO18_HonestyHumility_GreedAvoidance_2_R",
    "HEXACO18_HonestyHumility_Modesty_3_R",
    "HEXACO18_Emotionality_Fearfulness_4_R",
    "HEXACO18_Emotionality_Dependence_5_NR",
    "HEXACO18_Emotionality_Anxiety_6_NR",
    "HEXACO18_Extraversion_SocialSelfEsteem_7_R",
    "HEXACO18_Extraversion_SocialBoldness_8_R",
    "HEXACO18_Extraversion_Liveliness_9_R",
    "HEXACO18_Agreeableness_Forgiveness_10_NR",
    "HEXACO18_Agreeableness_Gentleness_11_NR",
    "HEXACO18_Agreeableness_Patience_12_R",
    "HEXACO18_Conscientiousnes_Diligence_13_R",
    "HEXACO18_Conscientiousnes_Prudence_14_R",
    "HEXACO18_Conscientiousnes_Organization_15_R",
    "HEXACO18_Openness_Unconventionality_16_R",
    "HEXACO18_Openness_AestheticAppreciation_17_NR",
    "HEXACO18_Openness_Creativity_18_NR",
]

function hexaco18(
    required = true,
    ticks = ["Disagree", "Agree"],
    items = hexaco18_items,
    dimensions = hexaco18_dimensions
) {
    var questions1_3 = []
    var questions4_6 = []
    var questions7_9 = []
    var questions10_12 = []
    var questions13_15 = []
    var questions16_18 = []
    for (const [index, element] of items.entries()) {
        q = {
            title: element,
            name: dimensions[index],
            type: "rating",
            displayMode: "buttons",
            // scaleColorMode: "colored",
            isRequired: required,
            minRateDescription: ticks[0],
            maxRateDescription: ticks[1],
            rateValues: [0, 1, 2, 3, 4, 5, 6],
        }
        if (index < 3) {
            questions1_3.push(q)
        } else if (index < 6) {
            questions4_6.push(q)
        } else if (index < 9) {
            questions7_9.push(q)
        } else if (index < 12) {
            questions10_12.push(q)
        } else if (index < 15) {
            questions13_15.push(q)
        } else {
            questions16_18.push(q)
        }
    }
    return [
        { elements: questions1_3 },
        { elements: questions4_6 },
        { elements: questions7_9 },
        { elements: questions10_12 },
        { elements: questions13_15 },
        { elements: questions16_18 },
    ]
}

// Make plot ========================================================================================================
function hexaco18_plot(screen = "questionnaire_hexaco18") {
    var data = jsPsych.data.get().filter({ screen: screen })
    data = data["trials"][0]["response"]

    // Make scores
    extraversion =
        6 -
        data["HEXACO18_Extraversion_SocialSelfEsteem_7_R"] +
        (6 - data["HEXACO18_Extraversion_SocialBoldness_8_R"]) +
        (6 - data["HEXACO18_Extraversion_Liveliness_9_R"])
    extraversion = (extraversion / 3 / 6) * 100

    agreeableness =
        data["HEXACO18_Agreeableness_Forgiveness_10_NR"] +
        data["HEXACO18_Agreeableness_Gentleness_11_NR"] +
        (6 - data["HEXACO18_Agreeableness_Patience_12_R"])
    agreeableness = (agreeableness / 3 / 6) * 100

    conscientiousness =
        data["HEXACO18_Conscientiousnes_Diligence_13_R"] +
        data["HEXACO18_Conscientiousnes_Prudence_14_R"] +
        (6 - data["HEXACO18_Conscientiousnes_Organization_15_R"])
    conscientiousness = (conscientiousness / 3 / 6) * 100

    emotionality =
        6 -
        data["HEXACO18_Emotionality_Fearfulness_4_R"] +
        data["HEXACO18_Emotionality_Dependence_5_NR"] +
        data["HEXACO18_Emotionality_Anxiety_6_NR"]
    emotionality = (emotionality / 3 / 6) * 100

    openness =
        6 -
        data["HEXACO18_Openness_Unconventionality_16_R"] +
        data["HEXACO18_Openness_AestheticAppreciation_17_NR"] +
        data["HEXACO18_Openness_Creativity_18_NR"]
    openness = (openness / 3 / 6) * 100

    honestyhumility =
        data["HEXACO18_HonestyHumility_Sincerity_1_NR"] +
        (6 - data["HEXACO18_HonestyHumility_GreedAvoidance_2_R"]) +
        (6 - data["HEXACO18_HonestyHumility_Modesty_3_R"])
    honestyhumility = (honestyhumility / 3 / 6) * 100

    // Prepare output
    var output = {
        names: [
            "Extraversion",
            "Agreeableness",
            "Conscientiousness",
            "Emotionality",
            "Openness",
            "Honesty/Humility",
        ],
        scores: [
            extraversion,
            agreeableness,
            conscientiousness,
            emotionality,
            openness,
            honestyhumility,
        ],
        label: "Your personality traits (%)",
    }
    return output
}

 var questionnaire_hexaco18 = {
            type: jsPsychSurvey,
            survey_json: {
                title: "About your personality",
                description:
                    "Please answer the following questions based on how accurately each statement describes you in general.",
                showQuestionNumbers: false,
                goNextPageAutomatic: true,
                pageNextText: "Next",
                pagePrevText: "Previous",
                showProgressBar: "aboveHeader",
                pages: hexaco18(),
            },
            data: {
                screen: "questionnaire_hexaco18",
            },
        }

var results_hexaco18 = {
            type: jsPsychCanvasButtonResponse,
            on_load: function () {
                document.querySelector("canvas").style.removeProperty("display") // Force it to center
            },
            stimulus: function (c) {
                var data = hexaco18_plot((screen = "questionnaire_hexaco18"))
                var ctx = c.getContext("2d")
                var plot = new Chart(
                    ctx,
                    make_radarplot(
                        (names = data.names),
                        (scores = data.scores),
                        (minmax = [0, 100]),
                        (label = data.label),
                        (color = [255, 99, 132])
                    )
                )
            },
            canvas_size: plot_getsize(),
            choices: ["Continue"],
            prompt: "<p>This chart represents how much you score on various personality traits. Remember that there are no good or bad trait, and that there is no 'normal'. Everybody is different!</p>",
        }

    /* Attitudes towards AI *==========================*/
    // Beliefs about Artificial Images Technology (BAIT)
// History:
// - BAIT-Original: Items specifically about CGI and artificial media originally in Makowski et al. (FakeFace study)
// - BAIT-14: Validated in FictionEro (with new items + removal of "I think"), where it was mixed with the 6 most
//   loading items of the positive and negative attitutes dimensions from the General Attitudes towards
//   Artificial Intelligence Scale (GAAIS; Schepman et al., 2020, 2022)
// - BAIT-14: Used in FakeNewsValidation
// - BAIT-12 (Current version): Used in FakeFace2.
//   - Removed 2 GAAIS items (GAAIS_Negative_9, GAAIS_Positive_7)
//   - Replaced "Artificial Intelligence" with "AI
//   - Change display (Analog scale -> Likert scale)

const bait_items = [
    // BAIT items
    "Current AI algorithms can generate very realistic images",
    "Images of faces or people generated by AI always contain errors and artifacts",
    "Videos generated by AI have obvious problems that make them easy to spot as fake",
    "Current AI algorithms can generate very realistic videos",
    "Computer-Generated Images (CGI) are capable of perfectly imitating reality",
    "Technology allows the creation of environments that seem just as real as reality",
    "AI assistants can write texts that are indistinguishable from those written by humans",
    "Documents and paragraphs written by AI usually read differently compared to Human productions",

    // Expectations
    // "Current AI algorithms can already create content that is indistinguishable from reality",

    // Discrimination skills
    // "I can easily distinguish between real and AI-generated images",
    // "I can easily distinguish between real and AI-generated text",

    // Attitutes (adapted from GAAIS; Schepman et al., 2023)
    "AI is dangerous",
    "I am worried about future uses of AI",
    "AI is exciting",
    "Much of society will benefit from a future full of AI",
]

const bait_dimensions = [
    "BAIT_1_ImagesRealistic",
    "BAIT_2_ImagesIssues",
    "BAIT_3_VideosRealistic",
    "BAIT_4_VideosIssues",
    "BAIT_5_ImitatingReality",
    "BAIT_6_EnvironmentReal",
    "BAIT_7_TextRealistic",
    "BAIT_8_TextIssues",
    "BAIT_9_NegativeAttitutes", // GAAIS_Negative_10
    "BAIT_10_NegativeAttitutes", // GAAIS_Negative_15
    "BAIT_11_PositiveAttitutes", // GAAIS_Positive_12
    "BAIT_12_PositiveAttitutes", // GAAIS_Positive_17
]

function bait_questions(
    required = true,
    ticks = ["Disagree", "Agree"], // In Schepman et al. (2022) they removed 'Strongly'
    items = bait_items,
    dimensions = bait_dimensions
) {
    // AI Expertise
    aiexpertise = [
        {
            title: "How knowledgeable do you consider yourself about Artificial Intelligence (AI) technology?",
            name: "BAIT_AI_Knowledge",
            type: "rating",
            displayMode: "buttons",
            isRequired: required,
            minRateDescription: "Not at all",
            maxRateDescription: "Expert",
            rateValues: [0, 1, 2, 3, 4, 5, 6],
        },
    ]

    // Make questions
    var questions = []
    for (const [index, element] of items.entries()) {
        q = {
            title: element,
            name: dimensions[index],
            type: "rating",
            displayMode: "buttons",
            // scaleColorMode: "colored",
            isRequired: required,
            minRateDescription: ticks[0],
            maxRateDescription: ticks[1],
            rateValues: [0, 1, 2, 3, 4, 5, 6],
        }
        questions.push(q)
    }

    // Randomize order
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[questions[i], questions[j]] = [questions[j], questions[i]]
    }

    return [
        { elements: aiexpertise },
        {
            elements: questions,
            description:
                "We are interested in your thoughts about Artificial Intelligence (AI). Please read the statements below carefully and indicate the extent to which you agree with each statement.",
        },
    ]
}

// Feedback ========================================================================================================
function bait_feedback(screen = "questionnaire_bait") {
    let dat = jsPsych.data.get().filter({ screen: screen })
    dat = dat["trials"][0]["response"]

    let score = (dat["BAIT_11_PositiveAttitutes"] + dat["BAIT_12_PositiveAttitutes"]) / 2
    let score_pop = 3.89 // Computed in FictionEro
    let text = "XX"
    if (score < score_pop) {
        text = "less"
    } else {
        text = "more"
    }

    // Round to 1 decimal (* 10 / 10)
    score = Math.round((score / 6) * 100 * 10) / 10
    score_pop = Math.round((score_pop / 6) * 100 * 10) / 10

    let feedback =
        "<h2>Results</h2>" +
        "<p>Based on your answers, it seems like you are <b>" +
        text +
        "</b> enthusiastic about AI (your score: " +
        score +
        "%) compared to the average population (average score: " +
        score_pop +
        "% positivity).<br></p>"
    return feedback
}

// Initialize experiment =================================================
var questionnaire_bait = {
            type: jsPsychSurvey,
            survey_json: {
                title: "Artificial Intelligence",
                // description: "",
                showQuestionNumbers: false,
                goNextPageAutomatic: true,
                // showProgressBar: "aboveHeader",
                pages: bait_questions(),
            },
            data: {
                screen: "questionnaire_bait",
            },
        }

var feedback_bait = {
            type: jsPsychHtmlButtonResponse,
            stimulus: function () {
                return bait_feedback((screen = "questionnaire_bait"))
            },
            choices: ["Continue"],
            data: { screen: "feedback_bait" },
        }
