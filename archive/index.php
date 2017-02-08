<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
  <title> Overwatch - Comp Builder </title>
  <meta name="description" content="">
  <meta name="viewport" content="width=device-width">

  <!-- javascript -->
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1/jquery-ui.min.js"></script>
  
  <script type="text/javascript">
    var data; var maps; var heroes;

    $(function() {
      $.getJSON( "ow.json", function(data) {
        maps = data.maps;
        heroes = data.heroes;
        console.log(data);
        LoadMapList();
      }).fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + error;
        console.log( "Request Failed: " + err );
      });
      $('#ddlMaps').on('change', function() { ChooseMap($(this).find(":selected").attr('value')); });
    });

    function LoadMapList() {
      var cur = $('#hdn_map').val();
      var ddl = $('#ddlMaps');

      ddl.find('option').remove();
      ddl.append($('<option />').attr('value','').text('Select a Map').attr('selected','selected'));
      $.each(maps, function(key, value) {
        var picked = ((cur != key)? false : true);
        ddl.append($('<option />').attr('value',key).text(value.name).attr('selected',picked));
      });
    }

    function ChooseMap(map) {
      if(map == '') { return false; } //Return if "Select a Map" is chosen
      $('.map-img').attr('style', 'background:url("'+maps[map]['img']+'") no-repeat center top').show();
      $('#map-hidden').val(map);
    }
  </script>

  <!-- styles -->
  <link href="//ajax.googleapis.com/ajax/libs/jqueryui/1/themes/start/jquery-ui.min.css" rel="stylesheet">
  <style>
    .map-img {
      height:295px; width:525px;
    }
  </style>
</head>

<body>
  <div class="page">
    <div class="content">
      <input type="hidden" name="map-hidden" id="map-hidden" value="" />

      <div class="map">
        Map: <select id="ddlMaps"></select> | Screen Shot: <input type="file" accept="image/*"><br />
        <div class="map-img" />
      </div><!-- .map -->

    </div><!-- .content -->
  </div><!-- .page -->
</body>
</html>