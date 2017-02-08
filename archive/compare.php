<?php

  $img_url = './img/uploads/1.jpg';
  $img = new \Imagick($img_url);
  $img->resizeImage(263, 145, 1, 0);
  echo '<img src="'.$img_url.'" alt="" style="height:295px;width:525px;" /><br />';

  $results = array();
  Match('ana', $img, $results);
  Match('bastion', $img, $results);
  Match('dva', $img, $results);
  Match('genji', $img, $results);
  /*Match('hanzo', $img, $results);
  Match('junkrat', $img, $results);
  Match('lucio', $img, $results);
  Match('mei', $img, $results);
  Match('mccree', $img, $results);
  Match('mercy', $img, $results);
  Match('pharah', $img, $results);
  Match('reaper', $img, $results);
  Match('reinhardt', $img, $results);
  Match('roadhog', $img, $results);
  Match('soldier', $img, $results);
  Match('sombra', $img, $results);
  Match('symmetra', $img, $results);
  Match('torbjorn', $img, $results);
  Match('tracer', $img, $results);
  Match('widowmaker', $img, $results);
  Match('winston', $img, $results);
  Match('zarya', $img, $results);
  Match('zenyatta', $img, $results);*/

  AssignPlaces($results);

  echo '<pre><code>'; print_r(json_encode($results)); echo '</code></pre>';

function Match($name, $big, &$results) {
  $small = new \Imagick('./img/heroes/snips/'.$name.'.jpg');
  
  $big->subImageMatch($small, $match, $similarity);
  //$isPictured = isSimilar($similarity); if($isPictured==0) { return false; }
  $results[] = array("name"=>$name, "x"=>$match['x'], "y"=>$match['y'], "similarity"=>$similarity, "isPictured"=>$isPictured);
}

function isSimilar($similarity) {
  if($similarity < 0.1) {
    return 1;
  }
  return 0;
}

function AssignPlaces(&$results) {
  $min=0; $max=0;
  usort($results,'y_sort');
  foreach($results as &$r) {
    if($r['y']<$min||$min==0) { $min=$r['y']; }
    if($r['y']>$max) { $max=$r['y']; }
    if($r['y']-$min>20) { $r['row']=2; } else { $r['row']=1; }
  }
  
  $min=0; $max=0; $x1=1; $x2=1;
  usort($results,'x_sort'); 
  foreach($results as &$r) {
    if($r['x']<$min||$min==0) { $min=$r['x']; }
    if($r['x']>$max) { $max=$r['x']; }
    if($r['y']==1) { $r['col']=$x1++; } else { $r['col']=$x2++; }
  }

  foreach ($results as $key => $row) {
      $y[$key] = $row['row'];
      $x[$key] = $row['col'];
  }

  // Sort the data with volume descending, edition ascending
  array_multisort($y, SORT_ASC, $x, SORT_ASC, $results);
}

function y_sort($a, $b) {
    return $b['y'] + $a['y'];
}
function x_sort($a, $b) {
    return $a['x'] - $b['x'];
}

?>