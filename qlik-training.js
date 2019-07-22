/*
 * Basic responsive mashup template
 * @owner Enter you name here (xxx)
 * www.shop.com
 * www.qlik.com/prod/hub
 */
/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );
var config = {
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === "https:"
};
require.config( {
	baseUrl: ( config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "") + config.prefix + "resources"
} );

require( ["js/qlik"], function ( qlik ) {
	qlik.setOnError( function ( error ) {
		$( '#popupText' ).append( error.message + "<br>" );
		$( '#popup' ).fadeIn( 1000 );
	} );
	$( "#closePopup" ).click( function () {
		$( '#popup' ).hide();
	} );


	var currentApp;

	qlik.getAppList(function(list){
		
		list.forEach(function(app) {

			var button = $("<button>Open</button>");
			button.on( "click", function() {
				//alert(app.qDocId);
				currentApp = qlik.openApp(app.qDocId, config);

				currentApp.getList("sheet", function(reply){
					console.log(reply);

					reply.qAppObjectList.qItems.forEach(function(item){
						var sheet = $("<li class='sheet'>" + item.qMeta.title + "</li>");
						
						item.qData.cells.forEach(function(cell){
							var object = $("<li class='object'>" + cell.name + "(" + cell.type + ") </li>");
							var ShowObjectButton = $("<button>Show Object</button>");

							ShowObjectButton.on("click", function(){
								currentApp.getObject("object-view", cell.name);
							});

							object.append(ShowObjectButton);
							sheet.append(object);
						});
						
						
						$("#sheet-list").append(sheet);
					});
				});
			});

			$("#app-list").append("<li>" + app.qDocName  + "</li>").append(button);
		});
	});


	$("#get-task-button").on("click",function(){
		qlik.callRepository('/qrs/task').success(function(reply) {
			$(document).append(JSON.stringify(reply));
		});
	});
} );