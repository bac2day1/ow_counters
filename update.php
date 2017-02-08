<?php header( 'Content-type: text/html; charset=utf-8' ); ?>
<?php 

  set_time_limit(120);

  // ERROR HANDLING
  error_reporting(E_ALL);
  ini_set('display_errors', '1');
  include('./simple_html_dom.php');

  // CONSTANT VARIABLES
  define('COUNTER_HERO_URL', 'http://www.owfire.com/overwatch/wiki/heroes/');

  // LOAD DATA FILE
  $json = file_get_contents('./data/ow.json');
  $MATRIX = json_decode($json, true);

  // PROCESS HEROES
  foreach($MATRIX['heroes'] as $hero) {

    if($hero['enabled']==1) {
      try {
        $hero_url = COUNTER_HERO_URL . $hero['data'] . '/counters';
        $MATRIX['heroes'][$hero['data']]['strong'] = array();
        $MATRIX['heroes'][$hero['data']]['weak'] = array();

        echo 'Processing Hero: ' . $hero['name'] . '...<br />';
        ob_flush();
        flush();
        $hero_html = file_get_html($hero_url);
        
        // PROCESS GOOD AGAINST
        foreach($hero_html->find('div[data-parent=strong]') as $elm) {
          $url = $elm->find('img', 0)->src;
          $up = $elm->find('span[class=up]', 0)->plaintext;
          $dn = $elm->find('span[class=down]', 0)->plaintext;
          $score = $up - $dn;
          $name = str_replace('.png','',str_replace('/images/wikibase/icon/heroes/', '', $url));  
          $MATRIX['heroes'][$hero['data']]['strong'][$name] = $score;
        }

        // PROCESS BAD AGAINST
        foreach($hero_html->find('div[data-parent=weak]') as $elm) {
          $url = $elm->find('img', 0)->src;
          $up = $elm->find('span[class=up]', 0)->plaintext;
          $dn = $elm->find('span[class=down]', 0)->plaintext;
          $score = $up - $dn;
          $name = str_replace('.png','',str_replace('/images/wikibase/icon/heroes/', '', $url));
          $MATRIX['heroes'][$hero['data']]['weak'][$name] = $score;
        }
      } catch(Exception $e) { die('0'); exit; }
      
      $MATRIX['heroes'][$hero['data']]['updated'] = date(DATE_RFC2822);
    }
  }

  ob_flush();
  flush();

  // SAVE TO DATA FILE AND PRINT IN ARRAY FORMAT
  $MATRIX['updated'] = date(DATE_RFC2822);
  $json = json_encode($MATRIX);
  file_put_contents('ow.json', $json);
  echo 'SAVED!<br /><pre><code>'; print_r($MATRIX); echo '</code></pre>';


?>