// Variables ===================================================================
var fiction_trialnumber = 1

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

var fiction_showimage1 = {
    type: jsPsychImageKeyboardResponse,
    stimulus: function () {
        return "stimuli/AMFD/" + jsPsych.timelineVariable("stimulus")
    },
    stimulus_height: function () {
        return window.innerHeight
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
    timeline_variables: stimuli.slice(0, 4), // TODO: remove this
    randomize_order: true,
    timeline: [fiction_fixation1, fiction_showimage1],
}
