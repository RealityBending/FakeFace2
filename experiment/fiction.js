// Condition assignment ============================================
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

function assignCondition(stimuli) {
    new_stimuli_list = []
    // Loop through unique categories
    for (let cat of [...new Set(stimuli.map((a) => a.Category))]) {
        // Get all stimuli of this category
        var cat_stimuli = stimuli.filter((a) => a.Category == cat)

        // Shuffle cat_stimuli
        cat_stimuli = shuffleArray(cat_stimuli) // Custom funciton defined above

        // Assign half to "Reality" condition and half to "Fiction" condition
        for (let i = 0; i < cat_stimuli.length; i++) {
            cat_stimuli[i].Condition =
                i < cat_stimuli.length / 2 ? "Reality" : "Fiction"
        }

        // Add to new_stimuli_list
        new_stimuli_list.push(...cat_stimuli)
    }
    return shuffleArray(new_stimuli_list)
}

// Variables ===================================================================
var fiction_trialnumber = 1
var color_cues = shuffleArray(["red", "blue", "green"])
color_cues = { Reality: color_cues[0], Fiction: color_cues[1] }
var text_cue = { Reality: "Photograph", Fiction: "AI-generated" }
stimuli = assignCondition(stimuli)

// Screens =====================================================================
var fiction_instructions1 = {
        type: jsPsychHtmlButtonResponse,
        stimulus:
            "<h1>Part 3/4</h1>" +
            "<div style='text-align: left'>" +
            "<p>In this part of the experiment, images of faces will be briefly flashed on the screen.</p>" +
            "<p>After each image, you will be asked a series of questions, such as:</p><ul>" +
            "<li><p>To what extent do you find this person <b>good-looking</b> (the degree to which the face is aesthetically appealing).</p></li>" +
            "<li><p>How <b>attractive</b> do you find this person (how drawn are you to this person).</p></li>" +
            "<li><p>To what extent do you find this person <b>trustworthy</b> (reliable, honest, responsible etc.,).</p></li>" +
            "<li><p>How much does this person remind you of <b>someone you know</b> (how familiar does this face look to you).</p></li><br>" +
            "<p>Below is an example of how the questions will appear after each image:</p></div>" +
            "<div style='float: center'><img src='utils/question_demo_2.png' height='400' style='border:5px solid #D3D3D3; padding:3px; margin:5px'></img>" +
            "<p>We are interested in your <b>first impressions</b>. Please respond according to your gut feelings.</p>",
            choices: ["Start"],
        data: { screen: "task_instructions_1" },
    }

var fiction_preloadstims = {
    type: jsPsychPreload,
    images: stimuli.map((a) => "stimuli/AMFD/" + a.stimulus),
}

var fiction_fixation1 = {
    type: jsPsychHtmlKeyboardResponse,
    // on_start: function () {
    //     document.body.style.cursor = "none"
    // },
    stimulus:
        "<div  style='font-size:500%; position:fixed; text-align: center; top:50%; bottom:50%; right:20%; left:20%'>+</div>",
    choices: ["s"],
    trial_duration: 500,
    save_trial_parameters: { trial_duration: true },
    data: { screen: "fiction_fixation1" },
}

var fiction_cue = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: function () {
        var cond = jsPsych.timelineVariable("Condition")
        return (
            "<div style='font-size:450%; position:fixed; text-align: center; top:50%; bottom:50%; right:20%; left:20%; color: " +
            color_cues[cond] +
            "'><b>" +
            text_cue[cond] +
            "</b></div>"
        )
    },
    data: function () {
        var cond = jsPsych.timelineVariable("Condition")
        return {
            screen: "fiction_cue",
            color: color_cues[cond],
            text: cond,
        }
    },
    choices: ["s"],
    trial_duration: 1000,
    save_trial_parameters: { trial_duration: true },
}

var fiction_showimage1 = {
    type: jsPsychImageKeyboardResponse,
    stimulus: function () {
        return "stimuli/AMFD/" + jsPsych.timelineVariable("stimulus")
    },
    stimulus_height: function () {
        return 0.9 * window.innerHeight
    },
    trial_duration: 2000,
    choices: ["s"],
    save_trial_parameters: { trial_duration: true },
    data: { screen: "fiction_image1" },
    on_finish: function (data) {
        data.trial_number = fiction_trialnumber
        fiction_trialnumber += 1
    },
}

var trait_items = []
    // Add Items on Attractiveness Trustworthiness and Familiarity
    for (const [index, element] of items.entries()) {
        trait_items.push({
            prompt: element,
            name: dimensions[index],
            ticks: scale1,
            required: true,
            min: 0,
            max: 1,
            step: 0.01,
            slider_start: 0.5
        })
    }

    var questionnaire1 = {
        type: jsPsychMultipleSlider, // this is a custom plugin in utils
        questions: trait_items,
        randomize_question_order: false,
        //preamble: '<div style="font-size:24px;"><b>Assuming that the face you saw was real</b><br></p></div>',
        require_movement: true,
        on_start: function () {
            ; (document.body.style.cursor = "auto"),
                (document.querySelector(
                    "#jspsych-progressbar-container"
                ).style.display = "inline")
        },
        data: {
            screen: "questionnaire1",
        },
    }

var fiction_phase1 = {
    timeline_variables: stimuli.slice(0, 6), // TODO: remove this
    timeline: [
        fiction_fixation1,
        fiction_cue,
        fiction_fixation1,
        fiction_showimage1,
        questionnaire1,
    ],
}
