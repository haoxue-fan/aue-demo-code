/**
 * jspsych-survey-number
 * a jspsych plugin for number response survey questions
 *
 * Haoxue Fan (modified jspsych-survey-text by Josh de Leeuw)
 *
 * documentation: docs.jspsych.org
 *  
 * What's different: 
 * - submit button: <button> -> <input type="submit">. change eventListener accordingly (the button, the querySelector)
 * - add <form> around the main text & delete <div>
 * - if prompt is undefined, then not show prompt
 * - todo in the future: understand why string nested in html can't be html formatted
 */


jsPsych.plugins['survey-number'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'survey-number',
    description: '',
    parameters: {
      questions: {
        type: jsPsych.plugins.parameterType.COMPLEX,
        array: true,
        pretty_name: 'Questions',
        default: undefined,
        nested: {
          prompt: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Prompt',
            default: undefined,
            description: 'Prompt for the subject to response'
          },
          value: {
            type: jsPsych.plugins.parameterType.STRING,
            pretty_name: 'Value',
            default: "",
            description: 'The string will be used to populate the response field with editable answer.'
          },
          rows: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Rows',
            default: 1,
            description: 'The number of rows for the response text box.'
          },
          columns: {
            type: jsPsych.plugins.parameterType.INT,
            pretty_name: 'Columns',
            default: 10,
            description: 'The number of columns for the response text box.'
          }
        }
      },
      preamble: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Preamble',
        default: null,
        description: 'HTML formatted string to display at the top of the page above all the questions.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default:  'Continue',
        description: 'The text that appears on the button to finish the trial.'
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].rows == 'undefined') {
        trial.questions[i].rows = 1;
      }
    }
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].columns == 'undefined') {
        trial.questions[i].columns = 10;
      }
    }
    for (var i = 0; i < trial.questions.length; i++) {
      if (typeof trial.questions[i].value == 'undefined') {
        trial.questions[i].value = "";
      }
    }

    var html = '';
    // show preamble text
    if(trial.preamble !== null){
      html += '<div id="jspsych-survey-number-preamble" class="jspsych-survey-number-preamble">'+trial.preamble+'</div>';
    }
    // add questions
    html += '<p></p>';
    html += '<form id="jspsych-survey-number-form" method="post">';

    for (var i = 0; i < trial.questions.length; i++) {
      // html += '<div id="jspsych-survey-number-"'+i+'" class="jspsych-survey-number-question" style="margin: 2em 0em;">';
      if (trial.questions[i].prompt != undefined) {
      html += '<p class="jspsych-survey-number">' + trial.questions[i].prompt + '</p>';}
      var autofocus = i == 0 ? "autofocus" : "";
      if(trial.questions[i].rows == 1){
        html += '<input type="number" name="#jspsych-survey-number-response-' + i + '" size="'+trial.questions[i].columns+'"  style="font-size:125%"'+autofocus+' required></input>';
      } else {
        html += '<textarea name="#jspsych-survey-number-response-' + i + '" cols="' + trial.questions[i].columns + '" rows="' + trial.questions[i].rows + '" '+autofocus+'>'+trial.questions[i].value+'</textarea>';
      }
      // html += '</div>';
    }
    html += '<p></p>'
    html += '<input type="submit" id="jspsych-survey-number-next" class="jspsych-survey-number jspsych-btn" value="'+trial.button_label+'"></input>';
    html += '</form>'
    // add submit button
    // html += '<button id="jspsych-survey-number-next" class="jspsych-btn jspsych-survey-number">'+trial.button_label+'</button>';

    

    display_element.innerHTML = html;

    // var node = display_element.getElementById("#jspsych-survey-number-form").lastChild
    // display_element.body.appendChild(form);
    
    display_element.querySelector('#jspsych-survey-number-form').addEventListener('submit', function(e) {
      e.preventDefault();
      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // create object to hold responses
      var question_data = {};
      // var matches = display_element.querySelectorAll('div.jspsych-survey-number-question');
      var matches = display_element.querySelectorAll('#jspsych-survey-number-form');
      for(var index=0; index<matches.length; index++){
        var id = "Q" + index;
        var val = matches[index].querySelector('textarea, input').value;
        var obje = {};
        obje[id] = val;
        Object.assign(question_data, obje);
      }
      // save data
      var trialdata = {
        "rt": response_time,
        "responses": JSON.stringify(question_data)
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    });

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
