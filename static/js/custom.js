/**
 * Resize function without multiple trigger
 *
 * Usage:
 * $(window).smartresize(function(){
 *     // code here
 * });
 */
(function($,sr){
    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
      var timeout;

        return function debounced () {
            var obj = this, args = arguments;
            function delayed () {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            }

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 100);
        };
    };

    // smartresize
    jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');
/**
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var CURRENT_URL = window.location.href.split('#')[0].split('?')[0],
    $BODY = $('body'),
    $MENU_TOGGLE = $('#menu_toggle'),
    $SIDEBAR_MENU = $('#sidebar-menu'),
    $SIDEBAR_FOOTER = $('.sidebar-footer'),
    $LEFT_COL = $('.left_col'),
    $RIGHT_COL = $('.right_col'),
    $NAV_MENU = $('.nav_menu'),
    $FOOTER = $('footer');



// Sidebar
function init_sidebar() {
// TODO: This is some kind of easy fix, maybe we can improve this
var setContentHeight = function () {
	// reset height
	$RIGHT_COL.css('min-height', $(window).height());

	var bodyHeight = $BODY.outerHeight(),
		footerHeight = $BODY.hasClass('footer_fixed') ? -10 : $FOOTER.height(),
		leftColHeight = $LEFT_COL.eq(1).height() + $SIDEBAR_FOOTER.height(),
		contentHeight = bodyHeight < leftColHeight ? leftColHeight : bodyHeight;

	// normalize content
	contentHeight -= $NAV_MENU.height() + footerHeight;

	$RIGHT_COL.css('min-height', contentHeight);
};

  $SIDEBAR_MENU.find('a').on('click', function(ev) {
	  console.log('clicked - sidebar_menu');
        var $li = $(this).parent();

        if ($li.is('.active')) {
            $li.removeClass('active active-sm');
            $('ul:first', $li).slideUp(function() {
                setContentHeight();
            });
        } else {
            // prevent closing menu if we are on child menu
            if (!$li.parent().is('.child_menu')) {
                $SIDEBAR_MENU.find('li').removeClass('active active-sm');
                $SIDEBAR_MENU.find('li ul').slideUp();
            }else
            {
				if ( $BODY.is( ".nav-sm" ) )
				{
					$SIDEBAR_MENU.find( "li" ).removeClass( "active active-sm" );
					$SIDEBAR_MENU.find( "li ul" ).slideUp();
				}
			}
            $li.addClass('active');

            $('ul:first', $li).slideDown(function() {
                setContentHeight();
            });
        }
    });

// toggle small or large menu
$MENU_TOGGLE.on('click', function() {
		console.log('clicked - menu toggle');

		if ($BODY.hasClass('nav-md')) {
			$SIDEBAR_MENU.find('li.active ul').hide();
			$SIDEBAR_MENU.find('li.active').addClass('active-sm').removeClass('active');
		} else {
			$SIDEBAR_MENU.find('li.active-sm ul').show();
			$SIDEBAR_MENU.find('li.active-sm').addClass('active').removeClass('active-sm');
		}

	$BODY.toggleClass('nav-md nav-sm');

	setContentHeight();

	$('.dataTable').each ( function () { $(this).dataTable().fnDraw(); });
});

	// check active menu
	$SIDEBAR_MENU.find('a[href="' + CURRENT_URL + '"]').parent('li').addClass('current-page');

	$SIDEBAR_MENU.find('a').filter(function () {
		return this.href == CURRENT_URL;
	}).parent('li').addClass('current-page').parents('ul').slideDown(function() {
		setContentHeight();
	}).parent().addClass('active');

	// recompute content when resizing
	$(window).smartresize(function(){
		setContentHeight();
	});

	setContentHeight();

	// fixed sidebar
	if ($.fn.mCustomScrollbar) {
		$('.menu_fixed').mCustomScrollbar({
			autoHideScrollbar: true,
			theme: 'minimal',
			mouseWheel:{ preventDefault: true }
		});
	}
};
// /Sidebar

	var randNum = function() {
	  return (Math.floor(Math.random() * (1 + 40 - 20))) + 20;
	};


// Panel toolbox
$(document).ready(function() {
    $('.collapse-link').on('click', function() {
        var $BOX_PANEL = $(this).closest('.x_panel'),
            $ICON = $(this).find('i'),
            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

        // fix for some div with hardcoded fix class
        if ($BOX_PANEL.attr('style')) {
            $BOX_CONTENT.slideToggle(200, function(){
                $BOX_PANEL.removeAttr('style');
            });
        } else {
            $BOX_CONTENT.slideToggle(200);
            $BOX_PANEL.css('height', 'auto');
        }

        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
    });

    $('.close-link').click(function () {
        var $BOX_PANEL = $(this).closest('.x_panel');

        $BOX_PANEL.remove();
    });
});
// /Panel toolbox

// Tooltip
$(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip({
        container: 'body'
    });
});
// /Tooltip

// Switchery
$(document).ready(function() {
    if ($(".js-switch")[0]) {
        var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
        elems.forEach(function (html) {
            var switchery = new Switchery(html, {
                color: '#26B99A'
            });
        });
    }
});
// /Switchery


// iCheck
$(document).ready(function() {
    if ($("input.flat")[0]) {
        $(document).ready(function () {
            $('input.flat').iCheck({
                checkboxClass: 'icheckbox_flat-green',
                radioClass: 'iradio_flat-green'
            });
        });
    }
});
// /iCheck

// Table
$('table input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('table input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});

var checkState = '';

$('.bulk_action input').on('ifChecked', function () {
    checkState = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('.bulk_action input').on('ifUnchecked', function () {
    checkState = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});
$('.bulk_action input#check-all').on('ifChecked', function () {
    checkState = 'all';
    countChecked();
});
$('.bulk_action input#check-all').on('ifUnchecked', function () {
    checkState = 'none';
    countChecked();
});

function countChecked() {
    if (checkState === 'all') {
        $(".bulk_action input[name='table_records']").iCheck('check');
    }
    if (checkState === 'none') {
        $(".bulk_action input[name='table_records']").iCheck('uncheck');
    }

    var checkCount = $(".bulk_action input[name='table_records']:checked").length;

    if (checkCount) {
        $('.column-title').hide();
        $('.bulk-actions').show();
        $('.action-cnt').html(checkCount + ' Records Selected');
    } else {
        $('.column-title').show();
        $('.bulk-actions').hide();
    }
}

function init_echarts() {

				if( typeof (echarts) === 'undefined'){ return; }
				console.log('init_echarts');


				  var theme = {
				  color: [
					  '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
					  '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
				  ],

				  title: {
					  itemGap: 8,
					  textStyle: {
						  fontWeight: 'normal',
						  color: '#408829'
					  }
				  },

				  dataRange: {
					  color: ['#1f610a', '#97b58d']
				  },

				  toolbox: {
					  color: ['#408829', '#408829', '#408829', '#408829']
				  },

				  tooltip: {
					  backgroundColor: 'rgba(0,0,0,0.5)',
					  axisPointer: {
						  type: 'line',
						  lineStyle: {
							  color: '#408829',
							  type: 'dashed'
						  },
						  crossStyle: {
							  color: '#408829'
						  },
						  shadowStyle: {
							  color: 'rgba(200,200,200,0.3)'
						  }
					  }
				  },

				  dataZoom: {
					  dataBackgroundColor: '#eee',
					  fillerColor: 'rgba(64,136,41,0.2)',
					  handleColor: '#408829'
				  },
				  grid: {
					  borderWidth: 0
				  },

				  categoryAxis: {
					  axisLine: {
						  lineStyle: {
							  color: '#408829'
						  }
					  },
					  splitLine: {
						  lineStyle: {
							  color: ['#eee']
						  }
					  }
				  },

				  valueAxis: {
					  axisLine: {
						  lineStyle: {
							  color: '#408829'
						  }
					  },
					  splitArea: {
						  show: true,
						  areaStyle: {
							  color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
						  }
					  },
					  splitLine: {
						  lineStyle: {
							  color: ['#eee']
						  }
					  }
				  },
				  timeline: {
					  lineStyle: {
						  color: '#408829'
					  },
					  controlStyle: {
						  normal: {color: '#408829'},
						  emphasis: {color: '#408829'}
					  }
				  },

				  k: {
					  itemStyle: {
						  normal: {
							  color: '#68a54a',
							  color0: '#a9cba2',
							  lineStyle: {
								  width: 1,
								  color: '#408829',
								  color0: '#86b379'
							  }
						  }
					  }
				  },
				  map: {
					  itemStyle: {
						  normal: {
							  areaStyle: {
								  color: '#ddd'
							  },
							  label: {
								  textStyle: {
									  color: '#c12e34'
								  }
							  }
						  },
						  emphasis: {
							  areaStyle: {
								  color: '#99d2dd'
							  },
							  label: {
								  textStyle: {
									  color: '#c12e34'
								  }
							  }
						  }
					  }
				  },
				  force: {
					  itemStyle: {
						  normal: {
							  linkStyle: {
								  strokeColor: '#408829'
							  }
						  }
					  }
				  },
				  chord: {
					  padding: 4,
					  itemStyle: {
						  normal: {
							  lineStyle: {
								  width: 1,
								  color: 'rgba(128, 128, 128, 0.5)'
							  },
							  chordStyle: {
								  lineStyle: {
									  width: 1,
									  color: 'rgba(128, 128, 128, 0.5)'
								  }
							  }
						  },
						  emphasis: {
							  lineStyle: {
								  width: 1,
								  color: 'rgba(128, 128, 128, 0.5)'
							  },
							  chordStyle: {
								  lineStyle: {
									  width: 1,
									  color: 'rgba(128, 128, 128, 0.5)'
								  }
							  }
						  }
					  }
				  },
				  gauge: {
					  startAngle: 225,
					  endAngle: -45,
					  axisLine: {
						  show: true,
						  lineStyle: {
							  color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
							  width: 8
						  }
					  },
					  axisTick: {
						  splitNumber: 10,
						  length: 12,
						  lineStyle: {
							  color: 'auto'
						  }
					  },
					  axisLabel: {
						  textStyle: {
							  color: 'auto'
						  }
					  },
					  splitLine: {
						  length: 18,
						  lineStyle: {
							  color: 'auto'
						  }
					  },
					  pointer: {
						  length: '90%',
						  color: 'auto'
					  },
					  title: {
						  textStyle: {
							  color: '#333'
						  }
					  },
					  detail: {
						  textStyle: {
							  color: 'auto'
						  }
					  }
				  },
				  textStyle: {
					  fontFamily: 'Arial, Verdana, sans-serif'
				  }
			  };

        //echart Line

     if ($('#echart_line').length ){

       $.ajax({
         url: '/stats/.json',
         data: $('form').serialize(),
         type: 'GET',
         success: function(response){
           var echartLine = echarts.init(document.getElementById('echart_line'), theme);
           var kernels = {};
           for (i in response['kernels']) {
             k = i.split('-')[0]
             if (k in kernels) {
               kernels[k] += 1;
             } else {
               kernels[k] = 1;
             }
           }
           dataPoint = [];
           count = 0;
           for (var key in kernels) {
             dataPoint[count] = {
               name: key,
               type: 'bar',
               smooth: true,
               itemStyle: {
                 normal: {
                   areaStyle: {
                    type: 'default'
                   }
                 }
               },
               data: [kernels[key]]
             }
             count++;
           }

           echartLine.setOption({
           title: {
             text: 'versions',
             subtext: ''
           },
           tooltip: {
             trigger: 'axis'
           },
           legend: {
             x: 220,
             y: 40,
             data: Object.keys(kernels)
           },
           toolbox: {
             show: true,
             feature: {
             magicType: {
               show: true,
               title: {
               bar: 'Bar',
               },
               type: ['bar']
             },
             restore: {
               show: true,
               title: "Restore"
             },
             saveAsImage: {
               show: true,
               title: "Save Image"
             }
             }
           },
           calculable: true,
           xAxis: [{
             type: 'category',
             boundaryGap: false,
             // data: Object.keys(kernels)
             data: ['']
           }],
           yAxis: [{
             type: 'value'
           }],
           series: dataPoint
           });
           }})
         }

        if ($('#hosts_teams').length ){

          $.ajax({
            url: '/stats/.json',
            data: $('form').serialize(),
            type: 'GET',
            success: function(response){
              var echartPieCollapse = echarts.init(document.getElementById('hosts_teams'), theme);
              var team = response['teams']

              dataPoint = [];
              count = 0;
              for (var key in team) {
                dataPoint[count] = {'value': team[key], 'name': key}
                count++;
              }

              echartPieCollapse.setOption({
              tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
              },
              legend: {
                x: 'center',
                y: 'bottom',
                data: Object.keys(team)
              },
              toolbox: {
                show: true,
                feature: {
                magicType: {
                  show: true,
                  type: ['pie', 'funnel']
                },
                restore: {
                  show: true,
                  title: "Restore"
                },
                saveAsImage: {
                  show: true,
                  title: "Save Image"
                }
                }
              },
              calculable: true,
              series: [{
                name: 'Team',
                type: 'pie',
                radius: [25, 90],
                center: ['50%', 170],
                roseType: 'area',
                x: '50%',
                max: 40,
                sort: 'ascending',
                data: dataPoint
              }]
              });
          }})
        }

        //echart Pie Collapse

       			if ($('#echart_pie2').length ){

              $.ajax({
                url: '/stats/.json',
                data: $('form').serialize(),
                type: 'GET',
                success: function(response){
           			  var echartPieCollapse = echarts.init(document.getElementById('echart_pie2'), theme);
                  var distributions = response['distributions'];
                  dataPoint = [];
                  count = 0;
                  for (var key in distributions) {
                    dataPoint[count] = {'value': distributions[key], 'name': key}
                    count++;
                  }

           			  echartPieCollapse.setOption({
           				tooltip: {
           				  trigger: 'item',
           				  formatter: "{a} <br/>{b} : {c} ({d}%)"
           				},
           				legend: {
           				  x: 'center',
           				  y: 'bottom',
           				  data: Object.keys(distributions)
           				},
           				toolbox: {
           				  show: true,
           				  feature: {
           					magicType: {
           					  show: true,
           					  type: ['pie', 'funnel']
           					},
           					restore: {
           					  show: true,
           					  title: "Restore"
           					},
           					saveAsImage: {
           					  show: true,
           					  title: "Save Image"
           					}
           				  }
           				},
           				calculable: true,
           				series: [{
           				  name: 'Distro',
           				  type: 'pie',
           				  radius: [25, 90],
           				  center: ['50%', 170],
           				  roseType: 'area',
           				  x: '50%',
           				  max: 40,
           				  sort: 'ascending',
           				  data: dataPoint
           				}]
           			  });
              }})
       			}

      if ($('#echart_pie3').length ){

        $.ajax({
          url: '/summary/.json',
          data: $('form').serialize(),
          type: 'GET',
          success: function(response){

        var echartPie = echarts.init(document.getElementById('echart_pie3'), theme);
        var apps = {};
        for (i in response['servers']) {
            distro = response['servers'][i]['server']['distribution_version'];
            if (distro in apps) {
              apps[distro] += 1;
            } else {
              apps[distro] = 1;
            }
        }
        dataPoint = [];
        count = 0;
        for (var key in apps) {
          dataPoint[count] = {'value': apps[key], 'name': key}
          count++;
        }

        echartPie.setOption({
        tooltip: {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          x: 'center',
          y: 'bottom',
          data: Object.keys(apps)
        },
        toolbox: {
          show: true,
          feature: {
          magicType: {
            show: true,
            type: ['pie', 'funnel'],
            option: {
            funnel: {
              x: '25%',
              width: '50%',
              funnelAlign: 'left',
              max: 1548
            }
            }
          },
          restore: {
            show: true,
            title: "Restore"
          },
          saveAsImage: {
            show: true,
            title: "Save Image"
          }
          }
        },
        calculable: true,
        series: [{
          name: 'distro release',
          type: 'pie',
          radius: '55%',
          center: ['50%', '48%'],
          data: dataPoint
        }]
        });

        var dataStyle = {
        normal: {
          label: {
          show: false
          },
          labelLine: {
          show: false
          }
        }
        };

        var placeHolderStyle = {
        normal: {
          color: 'rgba(0,0,0,0)',
          label: {
          show: false
          },
          labelLine: {
          show: false
          }
        },
        emphasis: {
          color: 'rgba(0,0,0,0)'
        }
        };
      }
    })
  }

			   //echart Pie
			if ($('#echart_pie').length ){

        $.ajax({
          url: '/stats/.json',
          data: $('form').serialize(),
          type: 'GET',
          success: function(response){

			  var echartPie = echarts.init(document.getElementById('echart_pie'), theme);
        var archs = response['architectures']

        dataPoint = [];
        count = 0;
        for (var key in archs) {
          dataPoint[count] = {'value': archs[key], 'name': key}
          count++;
        }

			  echartPie.setOption({
				tooltip: {
				  trigger: 'item',
				  formatter: "{a} <br/>{b} : {c} ({d}%)"
				},
				legend: {
				  x: 'center',
				  y: 'bottom',
          data: Object.keys(archs)
				},
				toolbox: {
				  show: true,
				  feature: {
					magicType: {
					  show: true,
					  type: ['pie', 'funnel'],
					  option: {
						funnel: {
						  x: '25%',
						  width: '50%',
						  funnelAlign: 'left',
						  max: 1548
						}
					  }
					},
					restore: {
					  show: true,
					  title: "Restore"
					},
					saveAsImage: {
					  show: true,
					  title: "Save Image"
					}
				  }
				},
				calculable: true,
				series: [{
				  name: 'architecture',
				  type: 'pie',
				  radius: '55%',
				  center: ['50%', '48%'],
          data: dataPoint
				}]
			  });

			  var dataStyle = {
				normal: {
				  label: {
					show: false
				  },
				  labelLine: {
					show: false
				  }
				}
			  };

			  var placeHolderStyle = {
				normal: {
				  color: 'rgba(0,0,0,0)',
				  label: {
					show: false
				  },
				  labelLine: {
					show: false
				  }
				},
				emphasis: {
				  color: 'rgba(0,0,0,0)'
				}
			  };
			}
    })
  }
}


// Accordion
$(document).ready(function() {
    $(".expand").on("click", function () {
        $(this).next().slideToggle(200);
        $expand = $(this).find(">:first-child");

        if ($expand.text() == "+") {
            $expand.text("-");
        } else {
            $expand.text("+");
        }
    });
});

// NProgress
if (typeof NProgress != 'undefined') {
    $(document).ready(function () {
        NProgress.start();
    });

    $(window).load(function () {
        NProgress.done();
    });
}


	  //hover and retain popover when on popover content
        var originalLeave = $.fn.popover.Constructor.prototype.leave;
        $.fn.popover.Constructor.prototype.leave = function(obj) {
          var self = obj instanceof this.constructor ?
            obj : $(obj.currentTarget)[this.type](this.getDelegateOptions()).data('bs.' + this.type);
          var container, timeout;

          originalLeave.call(this, obj);

          if (obj.currentTarget) {
            container = $(obj.currentTarget).siblings('.popover');
            timeout = self.timeout;
            container.one('mouseenter', function() {
              //We entered the actual popover – call off the dogs
              clearTimeout(timeout);
              //Let's monitor popover content instead
              container.one('mouseleave', function() {
                $.fn.popover.Constructor.prototype.leave.call(self, self);
              });
            });
          }
        };

        $('body').popover({
          selector: '[data-popover]',
          trigger: 'click hover',
          delay: {
            show: 50,
            hide: 400
          }
        });


	function gd(year, month, day) {
		return new Date(year, month - 1, day).getTime();
	}

	 /* AUTOSIZE */

		function init_autosize() {

			if(typeof $.fn.autosize !== 'undefined'){

			autosize($('.resizable_textarea'));

			}

		};

		  /* INPUTS */

			function onAddTag(tag) {
				alert("Added a tag: " + tag);
			  }

			  function onRemoveTag(tag) {
				alert("Removed a tag: " + tag);
			  }

			  function onChangeTag(input, tag) {
				alert("Changed a tag: " + tag);
			  }

		/* COMPOSE */

		function init_compose() {

			if( typeof ($.fn.slideToggle) === 'undefined'){ return; }
			console.log('init_compose');

			$('#compose, .compose-close').click(function(){
				$('.compose').slideToggle();
			});

		};

		/* DATA TABLES */

			function init_DataTables() {

				console.log('run_datatables');

				if( typeof ($.fn.DataTable) === 'undefined'){ return; }
				console.log('init_DataTables');

				var handleDataTableButtons = function() {
				  if ($("#datatable-buttons").length) {
					$("#datatable-buttons").DataTable({
					  dom: "Blfrtip",
					  buttons: [
						{
						  extend: "copy",
						  className: "btn-sm"
						},
						{
						  extend: "csv",
						  className: "btn-sm"
						},
						{
						  extend: "excel",
						  className: "btn-sm"
						},
						{
						  extend: "pdfHtml5",
						  className: "btn-sm"
						},
						{
						  extend: "print",
						  className: "btn-sm"
						},
					  ],
					  responsive: true
					});
				  }
				};

				TableManageButtons = function() {
				  "use strict";
				  return {
					init: function() {
					  handleDataTableButtons();
					}
				  };
				}();

				$('#datatable').dataTable();

				$('#datatable-keytable').DataTable({
				  keys: true
				});

				$('#datatable-responsive').DataTable();

				$('#datatable-scroller').DataTable({
				  ajax: "js/datatables/json/scroller-demo.json",
				  deferRender: true,
				  scrollY: 380,
				  scrollCollapse: true,
				  scroller: true
				});

				$('#datatable-fixed-header').DataTable({
				  fixedHeader: true
				});

				var $datatable = $('#datatable-checkbox');

				$datatable.dataTable({
				  'order': [[ 1, 'asc' ]],
				  'columnDefs': [
					{ orderable: false, targets: [0] }
				  ]
				});
				$datatable.on('draw.dt', function() {
				  $('checkbox input').iCheck({
					checkboxClass: 'icheckbox_flat-green'
				  });
				});

				TableManageButtons.init();

			};

	$(document).ready(function() {
		init_sidebar();
		init_DataTables();
		init_compose();
		init_autosize();
    init_echarts();
	});
