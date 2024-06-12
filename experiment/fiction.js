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

var fiction_phase1 = {
    timeline_variables: stimuli.slice(0, 6), // TODO: remove this
    timeline: [
        fiction_fixation1,
        fiction_cue,
        fiction_fixation1,
        fiction_showimage1,
    ],
}
