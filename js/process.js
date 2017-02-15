/*
Overwatch Counters - Type, paste, or speak Heroes and find out the best counters

**TODO**
- Voice: Add Hero
- Voice: Remove Hero
- Voice: Replace Hero
- Filter to Position (Tank, Support, etc.)
- Build team to meta option

**TESTS**
TEST 1: Ana, Mercy, Genji, Torbjorn, Roadhog, Reinheardt
TEST 2: Lucio, Zenyatta, Dva, Zarya, McCree, Soldier
TEST 3: Symmetra, Ana, Zenyatta, Reaper, Mei, Winston
TEST 4: Winston, Tracer, Hanzo, Bastion, Junkrat, Ana
TEST 5: Pharah, Widowmaker, Lucio, Reinhardt, Dva, Mei
TEST 6: Ana, Mercy, Reinheardt, Roadhog, Pharah, McCree

**ALL HEROES**
'ana', 'bastion', 'dva', 'genji', 'hanzo', 'junkrat', 'lucio', 'mccree', 'mei', 'mercy', 
'pharah', 'reaper', 'reinhardt', 'roadhog', 'soldier', 'sombra', 'symmetra', 'torbjorn', 
'tracer', 'widowmaker', 'winston', 'zarya', 'zenyatta'
*/

// Load Speech Recognition Variables
var heroes = [ 'ana', 'bastion', 'dva', 'genji', 'hanzo', 'junkrat', 'lucio', 'mccree', 'mei', 'mercy', 'pharah', 'reaper', 'reinhardt', 'roadhog', 'soldier', 'sombra', 'symmetra', 'torbjorn', 'tracer', 'widowmaker', 'winston', 'zarya', 'zenyatta'];
var grammar = '#JSGF V1.0; grammar hero; public <hero> = ' + heroes.join(' | ') + ' ;'
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var bg = document.querySelector('html');
var heroList;
var data; var maps; var heroes; var selected; var recommended; var notgood;

$(function() {
  heroList = $('#txtHeroes');
  heroPick = $('.hero_pick');
  recommended = $('.recommended');
  notgood = $('.notgood');
  record = $('#record');

  // Load stored JSON object
  $.getJSON( "./data/ow.json", function(data) {
    maps = data.maps;
    heroes = data.heroes;
    console.log(data);
    
    for(var hero in heroes) {
      heroPick.append('<img src="'+heroes[hero].img+'" alt="" title="'+upper(heroes[hero].data)+'" class="small_pic heroes hero-pick-'+heroes[hero].data+'" data-hero="'+heroes[hero].data+'" />');
    }

    $('.heroes').click(function() { 
      var h = $(this).data('hero');
      var listVal = heroList.val().toLowerCase();

      if(listVal.indexOf(h) >= 0) {
        heroList.val(heroList.val().replace(h,'').replace('  ',' ')); 
      } else {
        heroList.val(heroList.val() + ' ' + h);
      }
      ProcessRequest();
    });
  }).fail(function( jqxhr, textStatus, error ) {
    var err = textStatus + ", " + error;
    console.log( "Request Failed: " + err );
  });


  heroList.change(function() { ProcessRequest(); });
  heroList.click(function() { record.removeClass('active'); recognition.stop(); });
  record.click(function() { record.addClass('active'); recognition.start(); });

});

// Process Speech 
recognition.onresult = function(event) {
  var last = event.results.length - 1;
  var cmd = event.results[last][0].transcript.toLowerCase(); cmd = cmd.replace('road hog', 'roadhog');
  heroList.val(cmd);
  console.log('Confidence: ' + event.results[0][0].confidence);

  ProcessRequest();
}
recognition.onspeechend = function() { recognition.stop(); record.css('background-position', '0 0'); }
recognition.onnomatch = function(event) { diagnostic.textContent = "I didn't recognise that command."; }
recognition.onerror = function(event) { diagnostic.textContent = 'Error occurred in recognition: ' + event.error; }

// Process Input Request
function ProcessRequest() {
  var list = heroList.val().toLowerCase().replace(/,/g , "").split(' ');
  var good = new Array(); var bad = new Array();
  var good_detail = new Array(); var bad_detail = new Array();
  var picks = $('.hero_pick img');
  recommended.html('');
  notgood.html('');
  picks.removeClass('selected-hero');

  // Loop through each hero identified
  for(var hero in list) {
    var strong; var weak; var h;
    
    // Match Hero name input to actual hero
    if(list[hero] != '') {
      switch(list[hero]) {
        case 'ana':
        case 'anna':
          h='ana';
          break;
        case 'bastion':
        case 'bastian':
          h='bastion';
          break;
        case 'dva':
        case 'diva':
          h='dva';
          break;
        case 'genji':
          h='genji';
          break;
        case 'hanzo':
          h='hanzo';
          break;
        case 'junkrat':
          h='junkrat';
          break;
        case 'lucio':
        case 'lucia':
          h='lucio';
          break;
        case 'mccree':
        case 'free':
        case 'mccray':
        case 'macrae':
        case 'mccreary':
        case 'mcree':
        case 'macree':
          h='mccree';
          break;
        case 'mei':
        case 'may':
        case 'mae':
          h='mei';
          break;
        case 'mercy':
          h='mercy';
          break;
        case 'pharah':
        case 'sarah':
        case 'serra':
        case 'farrah':
        case 'bear':
          h='pharah';
          break;
        case 'reaper':
          h='reaper';
          break;
        case 'reinhardt':
        case 'reinhart':
        case 'rinehart':
        case 'reinhard':
        case 'reinheardt':
          h='reinhardt';
          break;
        case 'roadhog':
        case 'road':
          h='roadhog';
          break;
        case 'soldier':
        case 'soldier-76':
          h='soldier-76';
          break;
        case 'sombra':
          h='sombra';
          break;
        case 'symmetra':
        case 'symetra':
          h='symmetra';
          break;
        case 'torbjorn':
          h='torbjorn';
          break;
        case 'tracer':
          h='tracer';
          break;
        case 'widowmaker':
        case 'widow':
          h='widowmaker';
          break;
        case 'winston':
          h='winston';
          break;
        case 'zarya':
        case 'zaria':
        case 'aria':
          h='zarya';
          break;
        case 'zenyatta':
          h='zenyatta';
          break;
        default:
          console.log('no match: '+list[hero]);
          h='';
      }

      // If Hero found, store strong/weak values
      if(h!='') {
        $('.hero-pick-'+h).addClass('selected-hero');
        strong = heroes[h].strong;
        weak = heroes[h].weak;

        for(var itm in strong) { 
          good[itm] = (good[itm])? good[itm] + strong[itm]: strong[itm];
          var html = '<div style="float:left; width:25px; margin:1px; color:white; background:'+rateScore(strong[itm], 0)+';" title="'+upper(h)+'">'+getPicture(h,'tiny')+'<br /><div style="text-align:center;">'+strong[itm]+'</div></div>';
          good_detail[itm] = (good_detail[itm])? good_detail[itm]+html: html;
        }

        for(var itm in weak) { 
          bad[itm] = (bad[itm])? bad[itm] + weak[itm]: weak[itm]; 
          var html = '<div style="float:left; width:25px; margin:1px; color:white; background:'+rateScore(weak[itm], 1)+';" title="'+upper(h)+'">'+getPicture(h,'tiny')+'<br /><div style="text-align:center;">'+weak[itm]+'</div></div>';
          bad_detail[itm] = (bad_detail[itm])? bad_detail[itm]+html: html;
        }
      }
    }
  }

  // Sort Strong Against List
  var good_order = getSortedKeys(good);
  for(var i in good_order) { 
    var html = '<div class="hero_details"><div style="float:left">'+getPicture(good_order[i],'small')+'</div>';
    html += '<div><div class="hero-title">'+upper(good_order[i])+': <font style="color:'+rateScore(good[good_order[i]], 0)+';">'+good[good_order[i]]+'</font></div>'+good_detail[good_order[i]]+'</div><br style="clear:both;" /></div>';
    recommended.append(html);
  }
  
  // Sort Weak Against List
  var bad_order = getSortedKeys(bad);
  for(var i in bad_order) { 
    var html = '<div class="hero_details"><div style="float:left">'+getPicture(bad_order[i],'small')+'</div>';
    html += '<div><div class="hero-title">'+upper(bad_order[i])+': <font style="color:'+rateScore(bad[bad_order[i]], 1)+';">'+bad[bad_order[i]]+'</font></div>'+bad_detail[bad_order[i]]+'</div><br style="clear:both;" /></div>';
    notgood.append(html);
  }

}

// Sort Strong & Weak values 
function getSortedKeys(obj) {
    var keys = []; for(var key in obj) keys.push(key);
    return keys.sort(function(a,b){return obj[b]-obj[a]});
}

// Create Hero picture
function getPicture(h, size) {
  return '<img src="'+heroes[h].img+'" alt="" class="'+size+'_pic" />';
}

function upper(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function rateScore(score, direction) {
  if(direction) {
    if(score >= 200) {
      return 'darkgreen';
    } else if(score >= 0) {
      return '#A35405';
    } else {
      return 'darkred';       
    }
  } else {
    if(score > 200) {
      return 'darkred';
    } else if(score > 0) {
      return '#A35405';
    } else {
      return 'darkgreen';       
    }
  }
}