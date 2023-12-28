  
  formaltest = 1

  starting_coins = 250
  n_games = 3 
  n_trials = 10 
  min_bonus = 0
  bonus_scaler = 3 / (n_games * n_trials) //20 / (n_games * n_trials) // max is $4 <- short version this bonus needs to be divided by 2 at the end
  error_rate_cap = 0.4
  colors = ['Tomato', 'Coral', 'Yellow', 'DarkSeaGreen', 'DeepSkyBlue', 'Aquamarine', 'MediumPurple']

  trial_coins = starting_coins
  main_coins = starting_coins
  trial_points = 0
  main_points = 0
  //   pred_bonus = 1
  diff_threshold = 2

  trialArray = [] // used to locate prediction task (starting from trial 2)
  //   n_pred_per_game = 4
  
  for (var i = 2; i <= n_trials; i++) {
    trialArray.push(i);
  }

  // version control
  
  var version_array = [10];
  var version = jsPsych.randomization.sampleWithReplacement(version_array, 1);
  var weekId = version.toString(); // 1-prediction task; 2-no prediction task

  if(!formaltest){console.log(version, weekId)}

  // noise param
  if (version == 10){sd_observe = Math.sqrt(1)}
  if (version == 11){sd_observe = Math.sqrt(9)}
  if (version == 12){sd_observe = Math.sqrt(4)}

  sd_mean_mu = Math.sqrt(100)
  sd_diff = Math.sqrt(4)

  if (formaltest) { } // debug mode para
  else { n_games = 3; n_pred_per_game = 0; sd_observe = 0; }

  // start timeline

  timeline = []

  // add identifying information for primary key

  // store var 
  jsPsych.data.addProperties({
    sd_observe: sd_observe,
    sd_mean_mu: sd_mean_mu,
    sd_diff: sd_diff
  });

  // weeks of participation
  
  jsPsych.data.addProperties({
    weekId: weekId
  });

  // experiment Id
  // Slot Machine task (formerly "bandit task") = smb
  var expId = "smb_" + jsPsych.randomization.randomID(8);
  var eId = "smb";
  jsPsych.data.addProperties({
    expId: eId
  });

  // url
  var fullurl = window.location.href;
  jsPsych.data.addProperties({
    url: fullurl
  });

  // subject Id taken from URL
  var subjectId = jsPsych.data.getURLVariable('external_id');
  jsPsych.data.addProperties({
    subjectId: subjectId
  });

  // assignment Id taken from URL
  var studyId = jsPsych.data.getURLVariable('STUDY_ID');
  jsPsych.data.addProperties({
    studyId: studyId
  });

  // hit Id taken from URL
  var sessionId = jsPsych.data.getURLVariable('external_session_id');
  jsPsych.data.addProperties({
    sessionId: sessionId
  });

  recontact_flag = 1;
  // consent form
  var check_consent = function (elem) {
    if ($('#recontact_checkbox').is(':checked')) { recontact_flag = 0; console.log('do not wish to be recontact') }
    else { recontact_flag = 1; }
    if ($('#consent_checkbox').is(':checked')) { return true; }
    else {
      alert("If you wish to participate, you must check the box above the 'continue' button.");
      return false;
    }
    return false;
  };

  // var consent_block = {
  //   type: 'external-html',
  //   url: "consent.html",
  //   cont_btn: "start",
  //   check_fn: check_consent,
  //   on_finish: function (data) {
  //     jsPsych.data.addDataToLastTrial({
  //       exp_stage: "consent",
  //       primary_key: subjectId + '_' + weekId + '_' + expId + '_' + data.trial_index,
  //       exp_part: "consent"
  //     })
  //     data.recontact_flag = recontact_flag
  //     // console.log(data.recontact_flag)
  //   }
  // };
//   if (formaltest) { timeline.push(consent_block); }


  // general intro
  var general_intro = {
    type: 'instructions',
    pages: [
      "<p align='left'> Thanks for participating! This HIT will take around 30 minutes and consists of two parts. You will be paid $7 by completing the whole experiment.</p>" +
      "<p align='left'>The first part is a 10-15 min game. You will have the opportunity to earn bonus money in the game.</p>" +
      "<p align='left'> The second part is a questionnaire. you will be asked to report how you feel, think and behave both in the past and during the current situation. You will also be asked to report on characteristics of your mood, stress and sleep.</p>",
    ],
    show_clickable_nav: true,
    on_finish: function (data) {
      jsPsych.data.addDataToLastTrial({
        exp_stage: "general_intro",
        primary_key: subjectId + '_' + weekId + '_' + expId + '_' + data.trial_index,
        exp_part: "general_intro"
      })
    }
  };
  if (formaltest) { timeline.push(general_intro) }

  // fullscreen mode

  var fullscreen_intro = {
    type: 'instructions',
    pages: [
      "<p>On the next screen you will be asked to put your browser in full screen mode.</p>" +
      "<p>After entering full screen mode it is very important that you do not exit, switch tabs, minimize, or adjust the browser for the remainder of the game.</p>" +
      "<p>Doing so changes the display of the game and the game does not pause once started.</p>" +
      "<p>We can detect if you exit fullscreen, minimize the window, or switch to another tab, and we reserve the right to withold bonus/payment if this is indicated.</p>",
    ],
    show_clickable_nav: true,
    on_finish: function (data) {
      jsPsych.data.addDataToLastTrial({
        exp_stage: "fullscreen",
        primary_key: subjectId + '_' + weekId + '_' + expId + '_' + data.trial_index,
        exp_part: "fullscreen"
      })
    }
  };
//   if (formaltest) { timeline.push(fullscreen_intro) }

  var fullscreen = {
        type: 'fullscreen-everytrial',
        fullscreen_mode: true,
        message: '<p class = "instructions">You need to be in fullscreen mode to continue the experiment.</p>' +
            '<br><p class = instructions">Please click the button below to enter fullscreen mode.</p>',
        delay_after: 50,
        on_finish: function (data) {
            data.exp_stage = 'fullscreen'
            trial_index = jsPsych.data.get().last(1).values()[0].trial_index
            data.primary_key = subjectId + '_' + weekId + '_' + expId + '_' + trial_index,
                data.exp_part = "fullscreen"
        }
    };
//   if (formaltest) { timeline.push(fullscreen) }

  // instructions block

  var instructions = {
    type: 'instructions',
    pages: [
      "<p align='left'> Welcome to the <b>Slot Machines Game</b>!</p>" +
      "<p align='left'>This ask will take approximately 10 minutes to complete. </p>" +
      "<p align='left'> Click the <q>Next</q> button to continue.</p>",

      "<p align='left'> During this task, you will choose between two <q>slot machines</q>.</p>" +
      "<p align='left'> Playing the same slot machine will not always give you the same number of coins. </p>" +
      "<p align='left'> You will start out with <b>" + starting_coins + "</b> coins. Your goal is to win as many coins as possible overall. </p>",

      "<p align='left'> In this game slot machines are represented as colored buttons. </p>" +
      "<p align='left'> You play a machine  <i>by clicking on it with your mouse or trackpad. </i></p> " +
      "<p> After each play, you will see if you won coins, lost coins, or if nothing happened. </p>",

      "<p> As you can see below, the <q>slot machines</q> are labeled <q>stable</q> or <q>fluctuating</q>. </p>" +
      "<p><img src='img/bandit_example_slots_colored_fluctuating.png' style='height:100px;'></img> </p> " +
      "<p>Both machines generate rewards or losses around an average amount. </p>" +
      "<p>For the <b>stable</b> machines this average amount doesn't change. </p> <p> For the <b>fluctuating</b> machines this average amount fluctuates over time. </p>" +
      "<p>You will see how many coins you won or lost after each play. </p>" +
      "<p align='left'><b> Note that the color of the machine is independent of how many coins it gives. Also, you cannot predict how good a machine is based on whether it is Stable or Fluctuating.  A fluctuating machine may deliver more coins on average than a stable machine, or vice versa. </b></p>",

      "<p align='left'> You will complete <b>" + n_games + " rounds</b>, <b>each round has a different pair of slot machines.</b> </p> " +
      "<p align='left'> The outcome of playing a certain slot machine in one round does not effect the slot machines in other rounds </p> " +
      "<p align='left'><b> Each round will consist of " + n_trials + " plays. </b> </p> ",

      //   "<p align='left'> During the task, you will sometimes be asked to report <b>how many coins you think one machine generates in the next trial</b>. </p>" +
      //   "<p align='left'> You will also be asked to report your confidence in your estimate. You are encouraged to use the full range of the confidence scale.</p>",

      "<p align='left'> You will have the opportunity to earn up to <b>$3 bonus</b> by " +
      //   "<p align='left'> 1. <b>Report your coin estimate as accurately as possible</b>. By the end of the experiment, one of your coin estimates will be randomly chosen. </p>" +
      //   "<p align='left'> If your estimate on that chosen trial is within 2 of the true number of coins generated by the machine, you will win a bonus. </p>" +
      "<b>collecting as many coins as possible</b>. You will receive a bonus proportional to the number of coins you win in the game.</p>" +
      "<p align='left'> Please note that if you randomly <q>play</q> the machines or make random responses, we reserve the right to withold your bonus. </p>",

      "<p align='left'> Next, you will answer some questions to make sure you understand the task. </p> " +
      "<p align='left'>Then you will do a practice round to gain familiarity with the task. </p>" +
      "<p align='left'>Press the <q>Next</q> button to answer the comprehension questions.</p>"

    ],
    show_clickable_nav: true,
    on_finish: function (data) {
      data.exp_stage = 'instructions'
      trial_index = jsPsych.data.get().last(1).values()[0].trial_index
      data.primary_key = subjectId + '_' + weekId + '_' + expId + '_' + trial_index,
        data.exp_part = "instructions"
    }
  };
  if (formaltest) { timeline.push(instructions) }

  // instruction comprehension questions


  var instruction_questions = {
    type: 'survey-multi-choice',
    questions: [
      {
        prompt: "How do you <q>play</q> a machine?",
        options: ["I click my preferred choice on the screen",
          "I press the '1' or '2' keys on my keyboard to indicate my choice of the first or second option",
          "I press the left or right arrow keys on my keyboard to indicate my choice of the left or right option",
          "I press the 'Q' or 'P' keys on my keyboard to indicate my choice of the left or right option, respectively"]
      },
      {
        prompt: "What is the difference between stable and fluctuating machines?",
        options: [
          "Playing a stable machine always leads to winning more coins than a fluctuating machine.",
          "Playing a stable machine always leads to the same outcome. Playing a fluctuating machine leads to a different outcome each time.",
          "Playing a stable machine always lead to winning coins. Playing a fluctuating machine may lead to winning or losing coins.",
          "Playing a stable machine leads to outcomes generated around an unchanged average amount. Playing a fluctuating machine leads to outcomes generated around a fluctuating average amount."]
      },
      {
        prompt: "Which of the following statements about bonus is correct?",
        options: [
          //   "Whether I win a bonus only depends on the accuracy of my estimates.",
          "Whether I win a bonus only depends on the total coins I collect in the game.",
          //   "Whether I win a bonus depends both on the accuracy of my coin estimates and the total coins I have collected.",
          "Whether I win a bonus only depends on the speed I make choices.",
          "However I do in the task, the bonus is unchanged."
        ]
      }
    ],
    required: true,
    on_finish: function (data) {
      jsPsych.data.addDataToLastTrial({
        exp_stage: "instruction_questions",
        primary_key: subjectId + '_' + weekId + '_' + expId + '_' + data.trial_index,
        exp_part: "instructions"
      })
    }
  };
  if (formaltest) { timeline.push(instruction_questions); }

  // what they see if they answered one or both questions incorrectly the first time
  var redo_instructions = {
    type: 'instructions',
    pages: [
      "<p> Hmm...Based on one or more of your answers to the previous questions, it looks as if you may not fully understand the task. </p>" +
      "<p> If you are unable to answer the questions correctly again, we reserve the right to withold your bonus, and you may be asked to leave the study </p>" +
      "<p> Please click 'Next' to return to the instructions. </p>"

    ],
    show_clickable_nav: true,
    on_finish: function (data) {
      jsPsych.data.addDataToLastTrial({
        exp_stage: "instruction_fail_first",
        primary_key: subjectId + '_' + weekId + '_' + expId + '_' + data.trial_index,
        exp_part: "instructions"
      })
    },
  };

  // what they see if they answered one or both of the questions incorrectly more than once
  var failed_instructions = {
    type: 'instructions',
    pages: [
      "<p> We're sorry, it appears as if you have failed to answer one or both of the instruction comprehension questions twice. </p>" +
      "<p> You may not receive a bonus payment for this task </p>" +
      "<p> <b> If you fail to answer the instruction comprehension questions a third time you may be asked to leave the study. </b></p>"
    ],
    show_clickable_nav: true,
    on_finish: function (data) {
      jsPsych.data.addDataToLastTrial({
        exp_stage: "instruction_fail_again",
        primary_key: subjectId + '_' + weekId + '_' + expId + '_' + data.trial_index,
        exp_part: "instructions"
      })
    },
  };

  // evaluates question responses and loops timeline if questions are incorrect (part 3)
  // Note: you need all three parts (next two follow) for this function to work
  var instructions_understood3 = {
    timeline: [failed_instructions, instructions, instruction_questions],
    conditional_function: function () {
      var dat = jsPsych.data.getLastTrialData().values()[0];
      var dat1 = jsPsych.data.getLastTrialData().values()[1];
      var answer1 = JSON.parse(dat.responses).Q0;
      var answer2 = JSON.parse(dat.responses).Q1;
      var answer3 = JSON.parse(dat.responses).Q2;
      if (answer1.includes('click') == true && answer2.includes('unchanged') == true && answer3.includes('collect') == true) {
        return false;
      } else {
        return true;
      }
    },
  };

  // evaluates question responses and loops timeline if questions are incorrect (part 2)
  var instructions_understood2 = {
    timeline: [failed_instructions, instructions, instruction_questions, instructions_understood3],
    conditional_function: function () {
      var dat = jsPsych.data.getLastTrialData().values()[0];
      var dat1 = jsPsych.data.getLastTrialData().values()[1];
      var answer1 = JSON.parse(dat.responses).Q0;
      var answer2 = JSON.parse(dat.responses).Q1;
      var answer3 = JSON.parse(dat.responses).Q2;
      if (answer1.includes('click') == true && answer2.includes('unchanged') == true && answer3.includes('collect') == true) {
        return false;
      } else {
        return true;
      }
    },
  };

  // evaluates question responses and loops timeline if questions are incorrect (part 1)
  var instructions_understood = {
    timeline: [redo_instructions, instructions, instruction_questions, instructions_understood2],
    conditional_function: function () {
      var dat = jsPsych.data.getLastTrialData().values()[0];
      var dat1 = jsPsych.data.getLastTrialData().values()[1];
      var answer1 = JSON.parse(dat.responses).Q0;
      var answer2 = JSON.parse(dat.responses).Q1;
      var answer3 = JSON.parse(dat.responses).Q2;
      if (answer1.includes('click') == true && answer2.includes('unchanged') == true && answer3.includes('collect') == true) {
        return false;
      } else {
        return true;
      }
    },
  };

  if (formaltest) { timeline.push(instructions_understood); }



  // helper functions

  //randomize function
  function nrand(m, sd) {
    if (sd == 0) {
      return m;
    } else {
      var x1, x2, rad, y1;
      do {
        x1 = 2 * Math.random() - 1;
        x2 = 2 * Math.random() - 1;
        rad = x1 * x1 + x2 * x2;
      } while (rad >= 1 || rad == 0);

      var c = Math.sqrt(-2 * Math.log(rad) / rad);
      var y = Math.round((x1 * c * sd + m)); // sd not sd*2
      return y;
    }
  };

  // generate parameters for each trial
  function gen_params() {
    var k1 = Math.floor(Math.random() * 2); // machine: Stable/Fluctuating
    var sd_options = [sd_observe, sd_observe]
    var sd_diff_options = [0, sd_diff]; // diffusion sd
    var label = ["Stable", "Fluctuating"]; // button labels
    var sd0 = sd_mean_mu; // mean reward sd 
    var mu = nrand(0, sd0); // mean outcome
    var sd = sd_options[k1]
    var sd_rw = sd_diff_options[k1];
    var text = label[k1]; // Stable or Fluctuating
    return [mu, sd, text, sd_rw]
  }

  function gen_params_array(machine_param, block_length) {
    var mean_array = [];
    mean_array[0] = machine_param[0];
    var reward_array = [];
    reward_array[0] = nrand(machine_param[0], machine_param[1]);
    for (j = 1; j < block_length; j++) {
      mean_array[j] = nrand(mean_array[j - 1], machine_param[3]);
      reward_array[j] = nrand(mean_array[j], machine_param[1]);
    }
    return { mean_array, reward_array }
  }

  // determine the colors for buttons
  function get_colors() {
    var j, x, i;
    for (i = colors.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = colors[i];
      colors[i] = colors[j];
      colors[j] = x;
    }
    return colors.slice(0, 2);
  }

  var scale_confidence = ["0: Guessed randomly", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10: Very confident"];

  // practice trial run

  var trial_start = {
        type: 'html-button-response',
        stimulus: '<p class = "click_prompt"> Practice Trial </p>',
        choices: ['Start'],
        on_finish: function (data) {
            data.exp_stage = 'practice_start'
            trial_index = jsPsych.data.get().last(1).values()[0].trial_index
            data.primary_key = subjectId + '_' + weekId + '_' + expId + '_' + trial_index
            data.exp_part = "practice"
            //   insert_pred_index = 1
        }
    }
  timeline.push(trial_start)

  var machine1 = [0, 0, 0, 0]
  var machine2 = [0, 0, 0, 0]
  while (machine1[0] === machine2[0]) {
    var machine1 = [nrand(0, sd_mean_mu), sd_observe, "Stable", 0]
    var machine2 = [nrand(0, sd_mean_mu), sd_observe, "Fluctuating", sd_diff]
  }
  var machine1_array = gen_params_array(machine1, n_trials)
  var machine2_array = gen_params_array(machine2, n_trials)


  colors_oi = get_colors()

  trial_procedure = []

  //   insert_pred = jsPsych.randomization.sampleWithoutReplacement(trialArray, n_pred_per_game);


  for (var j = 0; j < n_trials; j++) {

    var prediction = {
      type: 'survey-number',
      preamble: function () {
        predict_pic = Math.floor(Math.random() * 2);
        if (predict_pic == 0) {
          var predict_color = jsPsych.data.get().last(2).values()[0].machine1_color
          var predict_machine_type = jsPsych.data.get().last(2).values()[0].machine1_type
          return '<p>How many coins do you think this machine will generate in the next trial?</p><p>Please enter your response in the box below (integers only). </p>' +
            '<div class="jspsych-html-button-response-button" style="display: inline-block; margin:0px 8px"><button class="jspsych-btn-machine", style="background-color: ' + predict_color + '; cursor: default" disabled/>' + predict_machine_type + '</button></div>' +
            '<div class="jspsych-html-button-response-button" style="display: inline-block; margin:0px 8px"><button class="jspsych-btn-machine", style="background-color: ' + 'Transparent' + '; cursor: default; border: none" disabled/>' + '' + '</button></div>'
        }
        else {
          var predict_color = jsPsych.data.get().last(2).values()[0].machine2_color
          var predict_machine_type = jsPsych.data.get().last(2).values()[0].machine2_type
          return '<p>How many coins do you think this machine will generate in the next trial?</p><p>Please enter your response in the box below (integers only). </p>' +
            '<div class="jspsych-html-button-response-button" style="display: inline-block; margin:0px 8px"><button class="jspsych-btn-machine", style="background-color: ' + 'Transparent' + '; cursor: default; border: none" disabled/>' + '' + '</button></div>' +
            '<div class="jspsych-html-button-response-button" style="display: inline-block; margin:0px 8px"><button class="jspsych-btn-machine", style="background-color: ' + predict_color + '; cursor: default" disabled/>' + predict_machine_type + '</button></div>'
        }
      },
      questions: [
        { name: 'mean prediction', required: true, }
      ],
      data: { block: "block_p", block_trial: "trial_" + (j + 1) },
      on_finish: function (data) {
        var dat2 = jsPsych.data.getLastTrialData().values()[0];
        var answer2 = JSON.parse(dat2.responses).Q0;
        // data.insert_pred_index = insert_pred_index;
        // insert_pred_index++;
        data.chosen_machine = predict_pic;
        data.pred_num = answer2;
        data.exp_stage = 'practice_pred'
        trial_index = jsPsych.data.get().last(1).values()[0].trial_index
        data.primary_key = subjectId + '_' + weekId + '_' + expId + '_' + trial_index
        data.exp_part = 'practice'
        data.cond = jsPsych.data.get().last(2).values()[0].cond
      }
    }

    var confidence = {
      type: 'survey-likert',
      questions: [
        { prompt: 'How confident are you in your estimation?', labels: scale_confidence, required: true, name: 'pred_conf' },
      ],
      data: { block: "block_p", block_trial: "trial_" + (j + 1) },
      on_finish: function (data) {
        var dat2 = jsPsych.data.getLastTrialData().values()[0];
        var answer2 = JSON.parse(dat2.responses).Q0;
        data.chosen_machine = predict_pic;
        data.exp_stage = 'practice_conf'
        trial_index = jsPsych.data.get().last(1).values()[0].trial_index
        data.primary_key = subjectId + '_' + weekId + '_' + expId + '_' + trial_index
        data.exp_part = 'practice'
        data.conf_rating = answer2;
        data.cond = jsPsych.data.get().last(2).values()[0].cond
      }
    };

    var stimulus = {
      type: 'html-button-response',
      button_html: ['<button class="jspsych-btn-machine", style = "background-color:' + colors_oi[0] + '">%choice%</button>',
      '<button class="jspsych-btn-machine", style = "background-color:' + colors_oi[1] + '">%choice%</button>'],
      stimulus: '<p class ="click_prompt">Choose the slot machine you want to play! </p>',
      choices: [machine1[2], machine2[2]],
      prompt: '',
      data: {
        machine1_color: colors_oi[0],
        machine1_type: machine1[2],
        mean1: machine1_array.mean_array[j],
        reward1: machine1_array.reward_array[j],
        machine2_color: colors_oi[1],
        machine2_type: machine2[2],
        mean2: machine2_array.mean_array[j],
        reward2: machine2_array.reward_array[j],
        block: 'block_p',
        block_trial: 'trial_' + (j + 1),
      },
      on_finish: function (data) {

        if (data.machine1_type == "Fluctuating" && data.machine2_type == "Stable") {
          data.cond = 1
        } else if (data.machine1_type == "Stable" && data.machine2_type == "Fluctuating") {
          data.cond = 2
        } else if (data.machine1_type == "Fluctuating" && data.machine2_type == "Fluctuating") {
          data.cond = 3
        } else if (data.machine1_type == "Stable" && data.machine2_type == "Stable") {
          data.cond = 4
        }
        data.exp_stage = 'practice_choice'
        trial_index = jsPsych.data.get().last(1).values()[0].trial_index
        data.primary_key = subjectId + '_' + weekId + '_' + expId + '_' + trial_index,
          data.exp_part = "practice"

        if (data.button_pressed == 0) {
          chosen_machine = "machine1"
        } else if (data.button_pressed == 1) {
          chosen_machine = "machine2"
        }
        data.chosen_machine = chosen_machine

        if (chosen_machine == "machine1") {
          reward = data.reward1
          data.reward = reward
        } else if (chosen_machine = "machine2") {
          reward = data.reward2
          data.reward = reward
        }

        if (data.mean1 > data.mean2 & chosen_machine == "machine1") {
          correct = true
          data.correct = true
        } else if (data.mean2 > data.mean1 & chosen_machine == "machine2") {
          correct = true
          data.correct = true
        } else {
          data.correct = false
        }

        curr_bonus = trial_points * bonus_scaler
        trial_coins = trial_coins + data.reward

        if (data.mean1 > data.mean2) {
          data.correct_choice = 'machine1'
        }
        else {
          data.correct_choice = 'machine2'
        }
      }
    };

    // feedback function
    var feedback = {
      type: 'html-keyboard-response',
      choices: jsPsych.NO_KEYS,
      trial_duration: 1000,
      stimulus: function () {
        reward = jsPsych.data.get().last(1).values()[0].reward

        if (reward > 0) {
          return '<p class="reward"><font color="green"> + ' + reward + '</font></p>' + '<p> Current Coins: ' + trial_coins + '</p>'
        } else if (reward < 0) {
          return '<p class="reward"><font color="red"> - ' + Math.abs(reward) + '</font></p>' + '<p> Current Coins: ' + trial_coins + '</p>'
        }
        else {
          return '<p class="reward"><font color="dimgray"> ' + reward + '</font></p>' + '<p> Current Coins: ' + trial_coins + '</p>'
        }
      },
      data: { block: "block_p", block_trial: "trial_" + (j + 1) },
      on_finish: function (data) {

        if (jsPsych.data.get().last(2).values()[0].machine1_type == "Fluctuating" && jsPsych.data.get().last(2).values()[0].machine2_type == "Stable") {
          data.cond = 1
        } else if (jsPsych.data.get().last(2).values()[0].machine1_type == "Stable" && jsPsych.data.get().last(2).values()[0].machine2_type == "Fluctuating") {
          data.cond = 2
        } else if (jsPsych.data.get().last(2).values()[0].machine1_type == "Fluctuating" && jsPsych.data.get().last(2).values()[0].machine2_type == "Fluctuating") {
          data.cond = 3
        } else if (jsPsych.data.get().last(2).values()[0].machine1_type == "Stable" && jsPsych.data.get().last(2).values()[0].machine2_type == "Stable") {
          data.cond = 4
        }
        data.exp_stage = 'practice_feedback'
        trial_index = jsPsych.data.get().last(1).values()[0].trial_index
        data.primary_key = subjectId + '_' + weekId + '_' + expId + '_' + trial_index
        data.exp_part = "practice"

      }
    };

    // if (insert_pred.indexOf(j + 1) !== -1) { // j starts from 0
    //   trial_procedure.push(prediction, confidence, stimulus, feedback)
    //   timeline.push(prediction, confidence, stimulus, feedback)
    // } else {
    // trial_procedure.push(fullscreen, stimulus, feedback)
    // timeline.push(fullscreen, stimulus, feedback)
    trial_procedure.push(stimulus, feedback)
    timeline.push(stimulus, feedback)
    // }

  }


  // var end_trial = {
  //   type: 'html-keyboard-response',
  //   stimulus: '<p>This marks the end of the Practice Trial.</p> <p>Press any key to continue to the main experiment.</p>',
  //   on_finish: function (data) {
  //     num_corr = jsPsych.data.get().last(2 * n_trials + 1).filter({ exp_stage: 'practice_choice', correct: true }).count()
  //     data.error_block = 1 - (num_corr / n_trials)

  //     jsPsych.data.addDataToLastTrial({
  //       exp_stage: "practice_end",
  //       primary_key: subjectId + '_' + weekId + '_' + expId + '_' + data.trial_index,
  //       suspicious: false,
  //       block: 'block_p',
  //       exp_part: "practice"
  //     })
  //   }
  // }

  var end_trial = {
    type: 'html-keyboard-response',
    stimulus: '<p>This marks the end of the Practice Trial.</p> <p>Press any key to continue to the main experiment.</p>',
    on_finish: function (data) {
      data.primary_key = subjectId + '_' + weekId + '_' + expId + '_' + data.trial_index

      data.suspicious = false;

      data.block = 'block_p'
      data.exp_part = 'practice'      
      data.exp_stage = 'practice_end'

      num_corr = jsPsych.data.get().last(2 * n_trials + 1).filter({ exp_stage: 'practice_choice', correct: true }).count()
      data.error_block = 1 - (num_corr / n_trials)
      
      data.suspicious_type = 'none'
      
    }
  }


  // evaluates if there was any suspicious behavior - clicking all one thing, or getting a low score - now we're adjusting it so that it's only that they have to click at least each button once
  // (getting rid of error rate) - 9/24/19

  var no_sus = {
    timeline: [end_trial],
    conditional_function: function (data) {
      num_machine1 = jsPsych.data.get().last(2 * n_trials + 1).filter({ exp_stage: 'practice_choice', chosen_machine: 'machine1' }).count()
      correct_oi = jsPsych.data.get().last(2 * n_trials + 1).filter({ exp_stage: 'practice_choice', correct: true }).count()
      error_rate = 1 - (correct_oi / (n_trials))
      if (num_machine1 == n_trials || num_machine1 == 0) {
        return false;
      }
      // else
      // if (error_rate >= error_rate_cap){
      //   return false;
      // }
      else {
        return true
      }
    }
  };
  timeline.push(no_sus);

  // First warning for suspicious trial
  var sus_1 = {
    type: 'instructions',
    pages: function (data) {
      num_machine1 = jsPsych.data.get().filter({ exp_stage: 'practice_choice', chosen_machine: 'machine1' }).count()

      if (num_machine1 == n_trials || num_machine1 == 0) {
        return [
          "<p align='left'> Hmm... You only ever played one machine. It looks as if you may not fully understand the task. </p>" +
          "<p align='left'> If you are unable to better perform in the practice trial a second time, we reserve the right to withold your bonus, and you may be asked to leave the study </p>" +
          "<p align='left'> Please click 'Next' to return to the instructions. </p>"
        ]
      }
      else {
        return [
          "<p align='left'> Hmm... Your choices of machines to play indicates that you may not fully understand the task at hand. </p>" +
          "<p align='left'> If you are unable to better perform in the practice trial a second time, we reserve the right to withold your bonus, and you may be asked to leave the study </p>" +
          "<p align='left'> Please click 'Next' to return to the instructions. </p>"
        ]
      }

    },
    show_clickable_nav: true,
    on_finish: function (data) {
      data.primary_key = subjectId + '_' + weekId + '_' + expId + '_' + data.trial_index
      data.suspicious = true
      data.block = 'block_p'
      data.exp_part = 'practice'

      num_corr = jsPsych.data.get().last(2 * n_trials + 1).filter({ exp_stage: 'practice_choice', correct: true }).count()
      data.error_block = 1 - (num_corr / n_trials)

      data.exp_stage = "practice_suspicion_flag"
      if (num_machine1 == n_trials || num_machine1 == 0) {
        data.suspicious_type = 'all_one'
      }
      else {
        data.suspicious_type = 'error_rate'
      }

    }
  }

  // second warning for suspicious trial
  var sus_2 = {
    type: 'instructions',
    pages: function (data) {
      num_machine1 = jsPsych.data.get().last(2 * n_trials + 1).filter({ chosen_machine: 'machine1' }).count()

      if (num_machine1 == n_trials || num_machine1 == 0) {
        return [
          "<p align='left'> Hmm... You only ever played one machine. It looks as if you may not fully understand the task. </p>" +
          "<p align='left'> If you are unable to better perform in the practice trial a third time, we reserve the right to withold your bonus, and you may be asked to leave the study </p>" +
          "<p align='left'> Please click 'Next' to return to the instructions. </p>"
        ]
      }
      else {
        return [
          "<p align='left'> Hmm... Your choices of machines to play indicates that you may not fully understand the task at hand. </p>" +
          "<p align='left'> If you are unable to better perform in the practice trial a third time, we reserve the right to withold your bonus, and you may be asked to leave the study </p>" +
          "<p align='left'> Please click 'Next' to return to the instructions. </p>"
        ]
      }

    },
    show_clickable_nav: true,
    on_finish: function (data) {
      data.primary_key = subjectId + '_' + weekId + '_' + expId + '_' + data.trial_index
      data.suspicious = true
      data.block = 'block_p'
      data.exp_part = 'practice'

      num_corr = jsPsych.data.get().last(2 * n_trials + 1).filter({ exp_stage: 'practice_choice', correct: true }).count()
      data.error_block = 1 - (num_corr / n_trials)

      data.exp_stage = "practice_suspicion_flag"
      if (num_machine1 == n_trials || num_machine1 == 0) {
        data.suspicious_type = 'all_one'
      }
      else {
        data.suspicious_type = 'error_rate'
      }

    }
  }

  // third and final warning for suspicious trial
  var final_bad = {
    type: 'instructions',
    pages: function (data) {
      num_machine1 = jsPsych.data.get().last(2 * n_trials + 1).filter({ chosen_machine: 'machine1' }).count()
      return [
        "<p align='left'> We're sorry, it appears as if you still do not fully understand the task. </p>" +
        "<p align='left'> We reserve the right to withold your bonus, and you may be asked to leave the study </p>" +
        "<p align='left'> Please click 'Next' to begin the main task. </p>"
      ]

    },
    show_clickable_nav: true,
    on_finish: function (data) {
      data.primary_key = subjectId + '_' + weekId + '_' + expId + '_' + data.trial_index
      data.suspicious = true
      data.block = 'block_p'
      data.exp_part = 'practice'

      num_corr = jsPsych.data.get().last(2 * n_trials + 1).filter({ exp_stage: 'practice_choice', correct: true }).count()
      data.error_block = 1 - (num_corr / n_trials)

      data.exp_stage = "practice_suspicion_flag"
      if (num_machine1 == n_trials || num_machine1 == 0) {
        data.suspicious_type = 'all_one'
      }
      else {
        data.suspicious_type = 'error_rate'
      }

    }
  }

  // evaluates if third warning/redo trial is necessary based on if they chose all the same thing (or if the error rate was high - removed)
  var sus_procedure3 = {
    timeline: [final_bad],
    data: { exp_part: 'practice' },
    conditional_function: function () {
      num_machine1 = jsPsych.data.get().last(2 * n_trials + 1).filter({ chosen_machine: 'machine1' }).count()
      correct_oi = jsPsych.data.get().last(2 * n_trials + 1).filter({ correct: true }).count()
      error_rate = 1 - (correct_oi / (3 * n_trials))

      if (num_machine1 == n_trials || num_machine1 == 0) {
        return true;
      }
      else if (error_rate >= error_rate_cap) {
        return true;
      }
      else {
        return false
      }
    },

  }

  todo2 = [sus_2].concat(trial_procedure)
  todo2 = todo2.concat([no_sus, sus_procedure3])

  var sus_procedure2 = {
    timeline: todo2,
    data: { exp_part: 'practice' },
    conditional_function: function () {
      num_machine1 = jsPsych.data.get().last(2 * n_trials + 1).filter({ chosen_machine: 'machine1' }).count()
      correct_oi = jsPsych.data.get().last(2 * n_trials + 1).filter({ correct: true }).count()
      error_rate = 1 - (correct_oi / (3 * n_trials))

      if (num_machine1 == n_trials || num_machine1 == 0) {
        return true;
      }
      // else if (error_rate >= error_rate_cap){
      //   return true;
      // }
      else {
        return false
      }
    },
  };

  todo1 = [sus_1].concat(trial_procedure)
  todo1 = todo1.concat([no_sus, sus_procedure2])

  var sus_procedure = {
    timeline: todo1,
    data: { exp_part: 'practice' },
    conditional_function: function () {
      num_machine1 = jsPsych.data.get().last(2 * n_trials + 1).filter({ chosen_machine: 'machine1' }).count()
      correct_oi = jsPsych.data.get().last(2 * n_trials + 1).filter({ correct: true }).count()
      error_rate = 1 - (correct_oi / (3 * n_trials))
      if (num_machine1 == n_trials || num_machine1 == 0) {
        return true;
      }
      // else
      // if (error_rate >= error_rate_cap){
      //   return true;
      // }
      else {
        return false;
        // timeline: [end_trial]
      }
    },
  };

  timeline.push(sus_procedure);


  // main experiment

  for (var i = 1; i < n_games + 1; i++) {
    var new_game = {
      type: 'html-button-response',
      stimulus: '<p class = "click_prompt"> Game ' + i + ' out of ' + n_games + '</p>',
      choices: ['Start'],
      on_finish: function (data) {
        data.exp_stage = 'block_start'
        trial_index = jsPsych.data.get().last(1).values()[0].trial_index
        data.primary_key = subjectId + '_' + weekId + '_' + expId + '_' + trial_index
        data.exp_part = 'main'
        // insert_pred_index = 1
      }
    }

    timeline.push(new_game)

    var machine1 = [0, 0, 0, 0]
    var machine2 = [0, 0, 0, 0]
    while (machine1[0] === machine2[0]) {
      var machine1 = gen_params()
      var machine2 = gen_params()
    }
    var machine1_array = gen_params_array(machine1, n_trials)
    var machine2_array = gen_params_array(machine2, n_trials)
    if (formaltest) { }
    else {
      console.log('current block: ', i)
      console.log('practice machine1 mean array: ', machine1_array.mean_array)
      console.log('practice machine2 mean array: ', machine2_array.mean_array)
    }

    colors_oi = get_colors()

    // update every game
    // insert_pred = jsPsych.randomization.sampleWithoutReplacement(trialArray, n_pred_per_game);

    for (var j = 0; j < n_trials; j++) {

      var prediction = {
        type: 'survey-number',
        preamble: function () {
          predict_pic = Math.floor(Math.random() * 2);
          if (predict_pic == 0) {
            var predict_color = jsPsych.data.get().last(2).values()[0].machine1_color
            var predict_machine_type = jsPsych.data.get().last(2).values()[0].machine1_type
            return '<p>How many coins do you think this machine will generate in the next trial?</p><p>Please enter your response in the box below (integers only). </p>' +
              '<div class="jspsych-html-button-response-button" style="display: inline-block; margin:0px 8px"><button class="jspsych-btn-machine", style="background-color: ' + predict_color + '; cursor: default" disabled/>' + predict_machine_type + '</button></div>' +
              '<div class="jspsych-html-button-response-button" style="display: inline-block; margin:0px 8px"><button class="jspsych-btn-machine", style="background-color: ' + 'Transparent' + '; cursor: default; border: none" disabled/>' + '' + '</button></div>'
          }
          else {
            var predict_color = jsPsych.data.get().last(2).values()[0].machine2_color
            var predict_machine_type = jsPsych.data.get().last(2).values()[0].machine2_type
            return '<p>How many coins do you think this machine will generate in the next trial?</p><p>Please enter your response in the box below (integers only). </p>' +
              '<div class="jspsych-html-button-response-button" style="display: inline-block; margin:0px 8px"><button class="jspsych-btn-machine", style="background-color: ' + 'Transparent' + '; cursor: default; border: none" disabled/>' + '' + '</button></div>' +
              '<div class="jspsych-html-button-response-button" style="display: inline-block; margin:0px 8px"><button class="jspsych-btn-machine", style="background-color: ' + predict_color + '; cursor: default" disabled/>' + predict_machine_type + '</button></div>'
          }
        },
        questions: [
          {
            name: 'mean prediction', required: true,
          }
        ],
        data: { block: "block_" + i, block_trial: "trial_" + (j + 1) },
        on_finish: function (data) {
          var dat2 = jsPsych.data.getLastTrialData().values()[0];
          var answer2 = JSON.parse(dat2.responses).Q0;
          //   data.insert_pred_index = insert_pred_index;
          //   insert_pred_index++;
          data.chosen_machine = predict_pic;
          data.pred_num = answer2;
          data.exp_stage = 'main_pred'
          trial_index = jsPsych.data.get().last(1).values()[0].trial_index
          data.primary_key = subjectId + '_' + weekId + '_' + expId + '_' + trial_index
          data.exp_part = 'main'
          data.cond = jsPsych.data.get().last(2).values()[0].cond
        }
      }

      var confidence = {
        type: 'survey-likert',
        questions: [
          { prompt: 'How confident are you in your estimation?', labels: scale_confidence, required: true, name: 'pred_conf' },
        ],
        data: { block: "block_" + i, block_trial: "trial_" + (j + 1) },
        on_finish: function (data) {
          var dat2 = jsPsych.data.getLastTrialData().values()[0];
          var answer2 = JSON.parse(dat2.responses).Q0;
          data.chosen_machine = predict_pic
          data.exp_stage = 'main_conf'
          trial_index = jsPsych.data.get().last(1).values()[0].trial_index
          data.primary_key = subjectId + '_' + weekId + '_' + expId + '_' + trial_index
          data.exp_part = 'main'
          data.conf_rating = answer2;
          data.cond = jsPsych.data.get().last(2).values()[0].cond
        }
      };

      var stimulus = {
        type: 'html-button-response',
        button_html: ['<button class="jspsych-btn-machine", style = "background-color:' + colors_oi[0] + '">%choice%</button>',
        '<button class="jspsych-btn-machine", style = "background-color:' + colors_oi[1] + '">%choice%</button>'],
        stimulus: '<p class="click_prompt"> Choose one by clicking </p>',
        choices: [machine1[2], machine2[2]],
        prompt: "",
        data: {
          machine1_color: colors_oi[0],
          machine1_type: machine1[2],
          mean1: machine1_array.mean_array[j],
          reward1: machine1_array.reward_array[j],
          machine2_color: colors_oi[1],
          machine2_type: machine2[2],
          mean2: machine2_array.mean_array[j],
          reward2: machine2_array.reward_array[j],
          block: 'block_' + i,
          block_trial: 'trial_' + (j + 1),
        },
        on_finish: function (data) {

          if (data.machine1_type == "Fluctuating" && data.machine2_type == "Stable") {
            data.cond = 1
          } else if (data.machine1_type == "Stable" && data.machine2_type == "Fluctuating") {
            data.cond = 2
          } else if (data.machine1_type == "Fluctuating" && data.machine2_type == "Fluctuating") {
            data.cond = 3
          } else if (data.machine1_type == "Stable" && data.machine2_type == "Stable") {
            data.cond = 4
          }

          data.exp_stage = 'main_choice'
          trial_index = jsPsych.data.get().last(1).values()[0].trial_index
          data.primary_key = subjectId + '_' + weekId + '_' + expId + '_' + trial_index
          data.exp_part = 'main'

          if (data.button_pressed == 0) {
            chosen_machine = "machine1"
          } else if (data.button_pressed == 1) {
            chosen_machine = "machine2"
          }
          data.chosen_machine = chosen_machine

          if (chosen_machine == "machine1") {
            reward = data.reward1
            data.reward = reward
          } else if (chosen_machine = "machine2") {
            reward = data.reward2
            data.reward = reward
          }

          if (data.mean1 > data.mean2 & chosen_machine == "machine1") {
            correct = true
            data.correct = true
            main_points = main_points + 1
          } else if (data.mean2 > data.mean1 & chosen_machine == "machine2") {
            correct = true
            data.correct = true
            main_points = main_points + 1
          } else {
            data.correct = false
          }

          data.curr_bonus = main_points * bonus_scaler
          main_coins = main_coins + data.reward

          if (data.mean1 > data.mean2) {
            data.correct_choice = 'machine1'
          }
          else {
            data.correct_choice = 'machine2'
          }

          if (data.chosen_machine == data.correct_choice) {
            data.trial_bonus = bonus_scaler
          } else {
            data.trial_bonus = "0"
          }

        }
      };


      var feedback = {
        type: 'html-keyboard-response',
        choices: jsPsych.NO_KEYS,
        trial_duration: 750,
        stimulus: function () {
          reward = jsPsych.data.get().last(1).values()[0].reward
          fb_block = jsPsych.data.getLastTrialData().values()[0].block
          if (reward > 0) {
            return '<p class="reward"><font color="green"> + ' + reward + '</font></p>' + '<p> Current Coins: ' + main_coins + '</p>'
          } else if (reward < 0) {
            return '<p class="reward"><font color="red"> - ' + Math.abs(reward) + '</font></p>' + '<p> Current Coins: ' + main_coins + '</p>'
          }
          else {
            return '<p class="reward"><font color="dimgray"> ' + reward + '</font></p>' + '<p> Current Coins: ' + main_coins + '</p>'
          }
        },
        data: { block: "block_" + i, block_trial: "trial_" + (j + 1) },
        on_finish: function (data) {

          if (jsPsych.data.get().last(2).values()[0].machine1_type == "Fluctuating" && jsPsych.data.get().last(2).values()[0].machine2_type == "Stable") {
            data.cond = 1
          } else if (jsPsych.data.get().last(2).values()[0].machine1_type == "Stable" && jsPsych.data.get().last(2).values()[0].machine2_type == "Fluctuating") {
            data.cond = 2
          } else if (jsPsych.data.get().last(2).values()[0].machine1_type == "Fluctuating" && jsPsych.data.get().last(2).values()[0].machine2_type == "Fluctuating") {
            data.cond = 3
          } else if (jsPsych.data.get().last(2).values()[0].machine1_type == "Stable" && jsPsych.data.get().last(2).values()[0].machine2_type == "Stable") {
            data.cond = 4
          }
          data.exp_stage = 'main_feedback'
          trial_index = jsPsych.data.get().last(1).values()[0].trial_index
          data.primary_key = subjectId + '_' + weekId + '_' + expId + '_' + trial_index
          data.exp_part = 'main'

        }
      }

      // push 
      //   if (insert_pred.indexOf(j + 1) !== -1) { // j starts from 0
      //     trial_procedure.push(prediction, confidence, stimulus, feedback)
      //     timeline.push(prediction, confidence, stimulus, feedback)
      //   } else {
    //   trial_procedure.push(fullscreen, (stimulus, feedback)
    //   timeline.push(fullscreen, stimulus, feedback)
    trial_procedure.push(stimulus, feedback)
      timeline.push(stimulus, feedback)
      //   }

    }

    var end_game = {
      type: 'html-button-response',
      stimulus: '<p class = "click_prompt"> End of Game ' + i + '</p> <p> Generating new machines for the next game! </p>',
      choices: ['Continue'],
      on_finish: function (data) {
        block_oi = jsPsych.data.get().last(3).values()[0].block
        num_machine1 = jsPsych.data.get().filter({ chosen_machine: 'machine1', block: block_oi }).count()

        ttl_correct = jsPsych.data.get().filter({ chosen_machine: 'machine1', correct_choice: 'machine1', block: block_oi }).count()
        ttl_correct = ttl_correct + jsPsych.data.get().filter({ chosen_machine: 'machine2', correct_choice: 'machine2', block: block_oi }).count()
        error_rate = 1 - (ttl_correct / n_trials)

        data.error_block = error_rate

        if (num_machine1 == n_trials || num_machine1 == 0) {
          data.suspicious = true
          data.suspicious_type = 'all_one'
        }
        else if (error_rate >= error_rate_cap) {
          data.suspicious = true
          data.suspicious_type = 'error_rate'
        }
        else {
          data.suspicious = 'false'
        }

        data.exp_stage = 'between_block'
        trial_index = jsPsych.data.get().last(1).values()[0].trial_index
        data.primary_key = subjectId + '_' + weekId + '_' + expId + '_' + trial_index
        data.exp_part = 'main'


      }
    }
    // }
  }

  // end of task - bonus feedback


  var bonus_block = {
    type: 'html-keyboard-response',
    stimulus: function (data) {
      rounded_bonus = Math.round(jsPsych.data.get().last(2).values()[0].curr_bonus)
      if (rounded_bonus < min_bonus) {
        rounded_bonus = min_bonus
      }
      // randomly pick one trial for prediction task
      //   random_pred_trial = Math.floor(Math.random() * Math.floor(n_pred_per_game - 1)) + 1; // start from zero
      //   random_block = Math.floor(Math.random() * Math.floor(n_games - 1)) + 1;
      //   random_block_trial = jsPsych.data.get().filter({ insert_pred_index: random_pred_trial, exp_part: 'main', block: 'block_' + random_block, exp_stage: 'main_pred' }).values()[0].block_trial;
      //   pred_coin = jsPsych.data.get().filter({ exp_part: 'main', block: 'block_' + random_block, block_trial: random_block_trial, exp_stage: 'main_pred' }).values()[0].pred_num;
      //   pred_machine = jsPsych.data.get().filter({ exp_part: 'main', block: 'block_' + random_block, block_trial: random_block_trial, exp_stage: 'main_pred' }).values()[0].pred_pic;
      //   if (pred_machine == 0) {
      //     mean_coin = jsPsych.data.get().filter({ exp_part: 'main', block: 'block_' + random_block, block_trial: random_block_trial, exp_stage: 'main_choice' }).values()[0].mean1;
      //     reward_coin = jsPsych.data.get().filter({ exp_part: 'main', block: 'block_' + random_block, block_trial: random_block_trial, exp_stage: 'main_choice' }).values()[0].reward1;
      //   }
      //   else {
      //     mean_coin = jsPsych.data.get().filter({ exp_part: 'main', block: 'block_' + random_block, block_trial: random_block_trial, exp_stage: 'main_choice' }).values()[0].mean2;
      //     reward_coin = jsPsych.data.get().filter({ exp_part: 'main', block: 'block_' + random_block, block_trial: random_block_trial, exp_stage: 'main_choice' }).values()[0].reward2;
      //   }
      //   pred_flag = (Math.abs(pred_coin - reward_coin)) <= diff_threshold;

      //   if (pred_flag) {
      //     pred_string = ["Congratulations! Your estimate was within 2 of the true number of coins; you won a bonus of <b>$" + pred_bonus + "</b> out of the prediction task.</p>"]
      //   }
      //   else {
      //     pred_bonus = 0 // change value
      //     pred_string = ["Oops! Your estimate was not within 2 of the true number of dots; we are sorry that you did not win a bonus from the prediction task.</p>"]
      //   }
      total_bonus = rounded_bonus 
      return "<p align='left'>This marks the end of the experiment.</p>" +
        "<p align='left'>Now let's calculate the bonus!</p>" +
        // "<p align='left'>In terms of the prediction task, the trial we randomly picked is Trial " + random_block_trial[6] + " Block " + random_block + ".The true number of coins generated was " + reward_coin + " and your estimate was " + pred_coin + ". " +
        //   pred_string +
        "<p align='left'>In terms of the general performance, you earned <b>$" + rounded_bonus + " </b>!</p>" +
        "<p align='left'>In total, you have won <b>$" + total_bonus + "</b> bonus. We will send the bonus after the experiment is completed.</p>" + //need wording!
        "<p align='left'>Thank you so much for your participation.</p>" +
        "<p align='left'>Your data will be displayed on the next page and are avaiable to download.</p>" +
        "<p align='left'>If you have any question, please don't hesitate and reach out to fanhaoxue@hotmail.com.</p>" +
        "<p align='left'>Press any key to continue.</p>"
    },
    on_finish: function (data) {
      //   data.random_pred_trial = random_pred_trial
      //   data.random_block = random_block
      //   data.random_block_trial = random_block_trial
      //   data.pred_flag = pred_flag
      //   data.pred_bonus = pred_bonus
      data.total_bonus = total_bonus
      block_oi = jsPsych.data.get().last(3).values()[0].block
      num_machine1 = jsPsych.data.get().filter({ chosen_machine: 'machine1', block: block_oi }).count()

      ttl_correct = jsPsych.data.get().filter({ chosen_machine: 'machine1', correct_choice: 'machine1', block: block_oi }).count()
      ttl_correct = ttl_correct + jsPsych.data.get().filter({ chosen_machine: 'machine2', correct_choice: 'machine2', block: block_oi }).count()
      error_rate = 1 - (ttl_correct / n_trials)

      data.error_block = error_rate

      if (num_machine1 == n_trials || num_machine1 == 0) {
        data.suspicious = true
        data.suspicious_type = 'all_one'
      }
      else if (error_rate >= error_rate_cap) {
        data.suspicious = true
        data.suspicious_type = 'error_rate'
      }
      else {
        data.suspicious = 'false'
      }

      data.exp_stage = 'end_bonus'
      trial_index = jsPsych.data.get().last(1).values()[0].trial_index
      data.primary_key = subjectId + '_' + weekId + '_' + expId + '_' + trial_index
      data.exp_part = 'main'
    }
    
  }

  if (formaltest) {
    timeline.push(bonus_block);
  }


  // saving time
  var save_wait_1 = {
    type: 'html-keyboard-response',
    stimulus:
      '<p> Please wait about 10 seconds while we save your data and load the questionnaire.</p>' +
      '<p> After you have finished the questionnaire, you will be redirected back to the experiment and get your completion code.</p>' +
      '<p> You will be automatically redirected to the next page momentarily.</p>',
    choices: [jsPsych.NO_KEYS],
    trial_duration: 10000,
    response_ends_trial: false,
    on_finish: function (data) {
      jsPsych.data.addDataToLastTrial({
        exp_stage: "data_saving",
        primary_key: subjectId + '_' + weekId + '_' + expId + '_' + data.trial_index,
        exp_part: "save"
      })
    }
  };
//   timeline.push(save_wait_1)

  keyLink = "https://harvard.az1.qualtrics.com/jfe/form/SV_3VLbIonSDDVfXxj?subjectId=" + subjectId + "&studyId=" + studyId + "&sessionId=" + sessionId + "&expId=" + expId;

  

  // experiment Id
  // Slot Machine task (formerly "bandit task") = smb
  var expId = "smb_" + jsPsych.randomization.randomID(8);
  var eId = "smb";
  jsPsych.data.addProperties({
    expId: eId
  });

  // url
  var fullurl = window.location.href;
  jsPsych.data.addProperties({
    url: fullurl
  });

  // subject Id taken from URL
  var subjectId = jsPsych.data.getURLVariable('external_id');
  jsPsych.data.addProperties({
    subjectId: subjectId
  });

  // assignment Id taken from URL
  var studyId = jsPsych.data.getURLVariable('STUDY_ID');
  jsPsych.data.addProperties({
    studyId: studyId
  });

  // hit Id taken from URL
  var sessionId = jsPsych.data.getURLVariable('external_session_id');
  jsPsych.data.addProperties({
    sessionId: sessionId
  });
  //
  // var comp_code = {
  //   type: 'html-keyboard-response',
  //   stimulus: '<p> Your compensation code is</p>' + comp_code + '<p> Press any key to finish the experiment </p>',
  //   response_ends_trial: true,
  //   on_finish: function(data) {
  //     jsPsych.data.addDataToLastTrial({
  //       exp_stage:"comp_code",
  //       primary_key: subjectId + '_' + weekId + '_' + expId + '_' + data.trial_index
  //     })
  //   }
  // };
  //
  // timeline.push(save_wait_1, save_wait_2, comp_code)

  // init experiment

  jsPsych.init({
    timeline: timeline,
    on_finish: function () {
    //   location.href = keyLink; 
    //   if (!formaltest) { 
        jsPsych.data.get().localSave('csv', 'smb_0.csv');
        jsPsych.data.displayData();
    //   }
      
    }
  });