

var scrollVis = function () {
  // define constants (proportions copied from JV)
  // var width = 600;
  var width = 400;
  var left_right_margin = 30;
  var top_bottom_margin = 60;
  // var height = 520;
  var height = 600;
  var format = d3.format(".0%");
  // define scroll index tracking vars - JV
  var lastIndex = -1;
  var activeIndex = 0;
  // define scales - one set of scales for all charts.
  var x0_scale = d3.scaleBand().padding(0.1).range([0, width-(left_right_margin*2)]);
  var x1_scale = d3.scaleLinear();
  var y_scale = d3.scaleLinear().range([height - (top_bottom_margin*2),0]);
  // define colours
  //all_colours - used during 1st section when survival rates not needed variable == "both".
  var all_colours = { Men: '#1f78b4', Women: '#a6cee3',all:"black",
  "0 - 15":"#addd8e","15 - 30":"#78c679","30 - 45":"#41ab5d","45 - 70":"#238443",">= 70":"#005a32",
  "1st Class": "#9e9ac8", "2nd Class":"#756bb1","3rd Class":"#54278f","School":"#C70039"};
  //survival colours - used during 2nd section when looking at survival rates.
  var survival_colours = {0:"#fb9a99", 1: "#404040"}

  var clusters2_colours = {0:"#F32424", 1: "#F32424",2:"#3A0088"}
  var clusters3_colours = {0:"#F32424", 1: "#FFB5B5",2:"#3A0088"}
  var weapon_colours={0:"#A7A7A71",2:"#A7A7A71",1:"#000000"}

  var class_colours = {"School":"#C70039",0:"#F15412"}

  var tedanders_colours = {1:"#F32424"}
  var columb_colours = {1:"#F32424",2:"#7D1E6A"}
  var myso_colours = {0:"#F32424", 1: "#F32424",2:"#3A0088", 9:"#3A0088"}

  var class_colours = {"School":"#C70039",0:"#F15412"}

  //sizes
  normal_size=4.5
  inc_size=1.6
  var  tedanders_size = {0:normal_size, 1:normal_size*inc_size, 2:normal_size, 8:normal_size,9:normal_size}
  var  columb_size = {0:normal_size, 1:normal_size*inc_size,2:normal_size*inc_size, 8:normal_size,9:normal_size}
  var  clusters2_size = {0:normal_size, 1:normal_size,2:normal_size*inc_size, 8:normal_size,9:normal_size}

  var  clusters3_1_size = {0:normal_size*inc_size, 1:normal_size,2:normal_size, 8:normal_size,9:normal_size}
  var   clusters3_2_size = {0:normal_size, 1:normal_size*inc_size,2:normal_size, 8:normal_size,9:normal_size}
  var myso_size={0:normal_size, 1:normal_size,2:normal_size, 8:normal_size,9:normal_size*inc_size}

  // define functions for the current scroll setting - inherited from JV
  var activateFunctions = [];
  //define data object and svg.
  var vis_data = {};
  var svg = "";

  //initialise chart - function inherited from JV, content not.
  var chart = function (selection) {

    selection.each(function (rawData) {
      //define svg.
      svg = d3.select(this).append("svg")
                           .attr('width', width)
                           .attr('height', height)
                           .attr('id', 'mainsvg')
                           .style("font-family", "Georgia")

                           ;

      // perform preprocessing on raw data - comments on logic below
      vis_data = convert_data(rawData);
      single_elements(vis_data); //draw elements that are not data dependent.
      set_up_sections(vis_data);
    });

  };
  //only need to append these elements once (with this data, no.of dots doesn't change but code is set up so it could)
  var single_elements = function (my_data) {
    //x axis
    svg.append("g").attr("class", "x_axis");
    //background image
    svg.append("svg:image")
      .attr("class","axes_image")
      .attr("xlink:href", "images/axes.png")
      .attr("height",520)
      .attr("width", 600)
      .attr("x", -60)
      .attr("y", height-520-(top_bottom_margin/4));

    svg.append("svg:image")
        .attr("class","tarrantgendron_image")
        .attr("xlink:href", "images/tarrantgendron.png")
        .attr("height",400)
        .attr("width", 400)
        .attr("x", 0)
        .attr("y", height-400-(top_bottom_margin/4));

      svg.append("svg:image")
            .attr("class","timeline_image")
            .attr("xlink:href", "images/timelineaxis.png")
            .attr("height",400)
            .attr("width", 800)
            .attr("x", -200)
            .attr("y", height-395-(top_bottom_margin/4));

            svg.append("svg:image")
                  .attr("class","fkaxis_image")
                  .attr("xlink:href", "images/fkaxis.png")
                  .attr("height",400)
                  .attr("width", 400)
                  .attr("x", -20)
                  .attr("y", height-400-(top_bottom_margin/4));

                  svg.append("svg:image")
                        .attr("class","doctype_image")
                        .attr("xlink:href", "images/doctype.png")
                        .attr("height",350)
                        .attr("width", 350)
                        .attr("x", 0)
                        .attr("y", height-450-(top_bottom_margin/4));

            svg.append("svg:image")
                              .attr("class","blocker_image")
                              .attr("xlink:href", "images/blocker.png")
                              .attr("height",400)
                              .attr("width", 400)
                              .attr("x", -20)
                              .attr("y", height-400-(top_bottom_margin/4));
  };
  //set up sections for scrolling.
  var set_up_sections = function (my_data) {
    // variables to be sent to draw_dots when the scroll index changes.
    activateFunctions[0] = ["all","both",0];
    activateFunctions[1] = ["gun","both",1000];
    activateFunctions[2] = ["p_class","doctype",1000];
    activateFunctions[3] = ["word_count","doctype",1000];
    activateFunctions[4] = ["fk_grade_level","doctype",1000];

    activateFunctions[5] = ["coord1","doctype",1000];
    activateFunctions[6] = ["coord1","tedanders",1000]; // ted/anders
    activateFunctions[7] = ["coord1","columb",1000]; // columb
    activateFunctions[8] = ["coord1","clusters2_1",1000]; // sex, survived not shown
    activateFunctions[9] = ["coord1","clusters3_1",1000]; // age, survived not shown
    activateFunctions[10] = ["coord1","clusters3_2",1000];   // all, survived not shown
    activateFunctions[11] = ["coord1","clusters2_2",1000]; // all, show survived
    activateFunctions[12] = ["coord1","myso",1000]; // sex, show survived
    activateFunctions[13] = ["network","network",0]; // age, show survived
    // activateFunctions[12] = ["ch_1_2","survived",1000];// class, show survived
    // activateFunctions[13] = ["ch_1_2","survived",1000]; // conclusion 1 - 1st and 2nd class children (< 15)
    activateFunctions[14] = ["year","clusters2_1",1000];//conclusion 2 - 1st and 2nd class women & children
    activateFunctions[15] = ["all","size",1000];


  };
  //part inherited from JV.
  //change is that I am repositioning the dots depending on the data every time the scroll index changes.
  //in JV version, all the charts are drawn initially and then shown.

  chart.update = function (index, progress) {
    var show_axes_image = [5,6,7,8,9,10,11,12]; //only show images on scroll index 1 and 5.
    if(show_axes_image.indexOf(index) >= 0){
      d3.select(".axes_image").attr("visibility","visible");
    } else {
      d3.select(".axes_image").attr("visibility","hidden");
    }

    var show_tarrantgendron_image = [110]; //only show images on scroll index 1 and 5.
    if(show_tarrantgendron_image.indexOf(index) >= 0){
      d3.select(".tarrantgendron_image").attr("visibility","visible");
    } else {
      d3.select(".tarrantgendron_image").attr("visibility","hidden");
    }

    var show_timeline_image = [14]; //only show images on scroll index 1 and 5.
    if(show_timeline_image.indexOf(index) >= 0){
      d3.select(".timeline_image").attr("visibility","visible");
    } else {
      d3.select(".timeline_image").attr("visibility","hidden");
    }

    var show_fkaxis_image = [4]; //only show images on scroll index 1 and 5.
    if(show_fkaxis_image.indexOf(index) >= 0){
      d3.select(".fkaxis_image").attr("visibility","visible");
    } else {
      d3.select(".fkaxis_image").attr("visibility","hidden");
    }

    var show_doctype_image = [2]; //only show images on scroll index 1 and 5.
    if(show_doctype_image.indexOf(index) >= 0){
      d3.select(".doctype_image").attr("visibility","visible");
    } else {
      d3.select(".doctype_image").attr("visibility","hidden");
    }

    var show_blocker_image = [0,1,15]; //only show images on scroll index 1 and 5.
    if(show_blocker_image.indexOf(index) >= 0){
      d3.select(".blocker_image").attr("visibility","visible");
    } else {
      d3.select(".blocker_image").attr("visibility","hidden");
    }

    activeIndex = index;
    var sign = (activeIndex - lastIndex) < 0 ? -1 : 1;
    var networksvg = document.getElementById("networksvg");

    var mainsvg = document.getElementById("mainsvg");

    //call draw dots with pre-defined variables
    if (activateFunctions[index][0]=='network'){
            // console.log('network')
            networksvg.style.display = "block"
            mainsvg.style.display = "none"
            // draw_dots(activateFunctions[index][0],activateFunctions[index][1],activateFunctions[index][2]);
            // var content = networksvg.innerHTML;
            //     networksvg.innerHTML= content
          // networksvg.innerHTML += "";

            // console.log("Refreshed");
            if (lastIndex !== activeIndex){
              // hide it here
            draw_graph();
          }
    } else{
           networksvg.style.display = "none"
           mainsvg.style.display = "block"

           // console.log('notwork')
    draw_dots(activateFunctions[index][0],activateFunctions[index][1],activateFunctions[index][2])
    }
  // }
    ;
    lastIndex = activeIndex;
  };

  var draw_dots = function (data_class, fill_type,transition){
    //define data - empty if none (ie first scroll index).
    if(data_class == "none"){
      var my_data = [];
    } else {
      var my_data = vis_data[data_class];
    }

    //reset scale domains and x1_scale range.
    x0_scale.domain(d3.set(my_data,function(d){return d[data_class]}).values());
    x1_scale.domain([0,d3.max(my_data,function(d){return d.column})+1]).range([0, x0_scale.bandwidth()]);
    y_scale.domain([0,43]);
    //set radius
    var my_radius = 4.5;
    //data,exit,enter and merge for bar labels
    var my_group = svg.selectAll(".labels_group")
                      .data(x0_scale.domain(),function(d){return d})

                      ;

    my_group.exit().remove();
    //enter new groups
    var enter = my_group.enter()
                        .append("g")
                        .attr("class","labels_group")



    //append rectangles to new group
    enter.append("text").attr("class","bar_text")

    //merge and remove
    my_group = my_group.merge(enter);
    //set for bar text attributes
    my_group.select(".bar_text")
            .attr("visibility","hidden") //hidden initially
            .attr("x",function(d){ return x0_scale(d) + (x0_scale.bandwidth()*0.45)})
            .attr("y",function(d){return y_scale(d3.max(my_data,function(m){if(m[data_class]==d){return m.row}})) - 15})
            .attr("fill",function(d){ //fill dependent on whether survival is being shown.
              if(fill_type == "both" | fill_type== "size"){
                return "black"
              } else {if(fill_type=="survived") {

                return survival_colours[1]

              }

              else {if(fill_type=="class" && data_class !=='coords1'){

                return all_colours[d]
              }
              } //if survival, show 'Survived' colour as text = survived %
            }

          })
            .text(function(d){
              //number of passengers in this group.
              var group_count = my_data.filter(function(m){if(m[data_class]==d){return m}}).length;
              if(fill_type == "both" | fill_type== "size" | data_class=="p_class" | data_class=="word_count"){
                return group_count //if no survival, show no of passengers.
              } else { if(fill_type=="survived") {
                //otherwise, calculate the passengers who survived and show survival rate - format defined on line 9
                var survival_count =  my_data.filter(function(m){if(m[data_class]==d && m.survived == 1){return m}}).length;
                return format(survival_count/group_count)
              }
              else  {if(fill_type=="class" & data_class!=='coords1'){
                // return m.incident_name
               return group_count
             }
             else{ if(fill_type=="gun"){
               // var gun_count =  my_data.filter(function(m){if(m[data_class]==d && m.weapon == 1){return m}}).length;
               // return format(gun_count/group_count)
                return 0
             }}

              }
            }
          }
        )
            .attr("transform","translate(" + left_right_margin + "," + top_bottom_margin + ")")
            .transition()
            .delay(transition*0.1)
            .attr("visibility","visible")


    //repeat data,exit,enter and merge for dots



    var my_group = svg.selectAll(".dots_group")
                      .data(my_data);



    my_group.exit().remove();
    //enter new groups
    var enter = my_group.enter()
                        .append("g")
                        .attr("class","dots_group")
    //append rectangles to new group
    enter.append("circle").attr("class","circle_dot")
    //merge and remove
    my_group = my_group.merge(enter);
    //define circle dot attributes
    my_group.select(".circle_dot")
            .transition()
            .duration(transition)
            .attr("cx",function(d){return (x0_scale(d[data_class])) + x1_scale(d.column)})
            .attr("cy",function(d){return y_scale(d.row)})
            .attr("fill",function(d){
              // console.error(d)//different fill depending on whether survived is shown (see above)
              if(fill_type == "both" | fill_type=="slize"){
                // console.error("all")
                return all_colours[d[data_class]]
              } else { if(fill_type == "survived"){

                return survival_colours[d.survived]
              } else {
                if(fill_type=="clusters2_1"| fill_type=="clusters2_2" |  fill_type=="size"){

                  return clusters2_colours[d.cluster]
              } else {
                if(fill_type=="clusters3_1"|fill_type=='clusters3_2'){
                  return clusters3_colours[d.cluster]
              }
              else {
              if (fill_type == "gun"){
                // console.error("gun")
                return weapon_colours[d.weapon]

              }
              else{
                if (fill_type =="doctype"){
                  return class_colours[d.p_class2]
                }
              else{
                if (fill_type =="tedanders"){
                  // console.error(d.cluster)
                  return tedanders_colours[d.example_color]
                }
                else{
                  if (fill_type =="columb"){
                    return columb_colours[d.example_color]
                  }
                  else{
                    if (fill_type =="myso"){
                      return myso_colours[d.highlight_color]
                    }
                    else{
                      if (fill_type =="c2example"){
                        return clusters2_colours[d.cluster]
                      }
                    }
                  }

                }

              }
              }
            }}}}}
          )
            // .attr("r",my_radius)
            .attr("r",function(d){
              if (fill_type == "size"){
              // console.error(d.killed)
              if((Math.log(d.killed+1)+4.5)>50){
                return 50
              } else {
              return Math.log(d.killed+1)+4.5
            }
            }
              else{

            if(fill_type== "tedanders"){
              return tedanders_size[d.example_color]
            }
            else{
              if( fill_type=="columb"){
                return columb_size[d.example_color]
              }
              else{
                if( fill_type=="clusters3_1"){
                  return clusters3_1_size[d.cluster]
                }
                else{
                if(fill_type=="clusters3_2"){
                  return clusters3_2_size[d.cluster]
                }
                else{
                if(fill_type=="clusters2_1"){
                  return normal_size
                }
                else{
                  if(fill_type=="clusters2_2"){
                    return clusters2_size[d.cluster]
                  }
                else {
                  if(fill_type=="myso"){
                    return myso_size[d.highlight_color]
                  }
                  else{
                    return my_radius
                  }
                }
                }
                }
                }
              }


              }
            }
          })

          .attr("opacity", function() {
      return 0.9
    })
            .attr("transform","translate(" + left_right_margin + "," + top_bottom_margin + ")")

            ;

      my_group.append("text").attr("class","node_label")


      var label_trans = {
        'eharris':[6,-1],
 'dklebold':[6,-1],
 'alanza':[6,5],
 'ncruz':[6,1],
 'peauvinen':[6,1],
 'psgendron':[-20,20],
 'bhtarrant':[0,0],
 'pwcrusius':[2,-10],
 'chmercer':[-100,20],
 'cdorner':[6,1],
 'glu':[6,1],
 'jholmes':[6,1],
 'shcho':[9,0],
 'erodger':[9,0],
 'frjames':[6,1],
 'tkaczynski':[-9,21],
 'tmcveigh':[-70,-10],
 'kkinkel':[6,1],
 'watchison':[6,1],
 'sbosse':[6,1],
 'acastillo':[6,1],
 'wmoliveira':[6,1],
 'kgill':[6,1],
 'ahribal':[6,1],
 'mlepine':[6,1],
 'mmay':[0,0],
 'dmorrison':[6,1],
 'kpierson':[6,1],
 'eramsey':[6,1],
 'jreyes':[6,1],
 'jromano':[6,1],
 'rstair':[9,0],
 'jwong':[6,1],
 'asonboly':[6,1],
 'cwhitman':[6,1],
 'cmanson':[6,1],
 'abbreivik':[5,-1],
 'zodiac':[6,1],
 'sballiet':[6,1],
 'jtearnest':[6,1],
 'dtsarnaev':[6,1],
 'obinladen':[6,1],
 'jweise':[6,1],
 'gsodini':[9,0],
 'droof':[0,20],
 'rbowers':[6,1],
 'pmanshaus':[6,1],
 'alpettersson':[6,-1],
 'erudolph':[-40,0],
 'wunderground':[6,1],
 'ira':[6,1],

     };

      my_group.select(".node_label")

              // .attr("visibility","hidden")
              .attr("dx", function(d){return (x0_scale(d[data_class])) + x1_scale(d.column)+label_trans[d.shortname][0]})
              .attr("dy", function(d){return y_scale(d.row)+label_trans[d.shortname][1]})
              .text(function(d) {
              if(fill_type=="tedanders" & ["abbreivik","tkaczynski"].includes(d.shortname)) {
                // console.error(d.name)
                return d.lname
              }
              else{
                if(fill_type=="columb" & ["abbreivik","tkaczynski","eharris","dklebold"].includes(d.shortname)) {
                  // console.error(d.name)
                  return d.lname
              }
              else{
                if(fill_type=="clusters3_1" & ["abbreivik","tkaczynski","bhtarrant","psgendron"].includes(d.shortname)) {
                  // console.error(d.name)
                  return d.lname
              }
              else{
                if(fill_type=="clusters3_2" & ["pwcrusius","droof","tmcveigh","erudolph","chmercer","cdorner"].includes(d.shortname)) {
                  // console.error(d.name)
                  return d.lname

                }
                else{
                  if(fill_type=="clusters2_2" & ["rstair","shcho","ncruz","alanza"].includes(d.shortname)) {
                    // console.error(d.name)
                    return d.lname

                  }
                  else{
                    if(fill_type=="myso"
                    & ["erodger","gsodini"].includes(d.shortname)
                  ) {
                      // console.error(d.name)
                      return d.lname

                    }
                  else{return ''}
              }
            }
              }

            }
          }})
              // .text(function(d) {return d.name})
              .attr("transform","translate(" + left_right_margin + "," + top_bottom_margin + ")")
              .transition()
              .delay(transition*0.1)
              .attr("visibility","visible")
              ;

    // enter.append("text").attr("class","node_lab")
    // my_group = my_group.merge(enter);
    //
    // my_group.select(".node_lab")
    //         .attr("x",function(d){return (x0_scale(d[data_class])) + x1_scale(d.column)})
    //         .attr("y",function(d){return y_scale(d.row)})
    //             .text(d.incident_name)
    //             .attr("visibility","visible");
    //reset x_axis
    d3.select(".x_axis")

      .attr("transform", "translate(" + left_right_margin + "," + ((top_bottom_margin *1.2)+ y_scale.range()[0]) + ")")

      .call(d3.axisBottom(x0_scale))


      ;





  };

  // return chart function
  return chart;
};

//JV function - with some elements removed.
function display(data) {
  // create a new plot and
  // display it
  var plot = scrollVis();
  d3.select('#vis')
    .datum(data)
    .call(plot);

  // setup scroll functionality
  var scroll = scroller().container(d3.select('#graphic'));

  // pass in .step selection as the steps
  scroll(d3.selectAll('.step'));

  // setup event handling
   scroll.on('active', function (index) {
     // highlight current step text
     d3.selectAll('.step')
       .style('opacity', function (d, i) { return i === index ? 1 : 0.1; });
   });

  scroll.on('progress', function (index, progress) {
    plot.update(index, progress);
  });
}

// load data and display
d3.csv('data/manif01.csv', display);

//data functions.  returns 6 different datasets, all with 891 entries (passenger count)
//data is split into sections - ie ["male","female"], given a per_row count - ie two_per_row
//and for each sections, a dot position (row, column) is generated for each entry
//with a maximum of per_row_count in each row.

//all has only one section
//sex, age and p_class are linked to the data variables
//ch_1_2 and w_ch_1_2 are custom sections linked to my conclusions (ie children under 15 in 1st and 2nd Class v remaining passengers)


function convert_data(my_data){

  var all_per_row = 7;
  var two_per_row = 20;
  var three_per_row = 14;
  var five_per_row = 10;
  var six_per_row=5;
  var year_per_row=1;
  var gun_per_row=50;
  var fk_per_row=51;


  var all = get_positions(my_data,all_per_row,[]);
  // var size =get_positions(my_data,all_per_row,[]);
  var sex = get_positions(my_data,two_per_row,["male","female"],"Sex");
  var age = get_positions(my_data,five_per_row,[0,15,30,45,70],"Age");
  var p_class = get_positions(my_data,4,[0,1,2,4,9,3],"Pclass");
  var year = get_positions(my_data,year_per_row,[1966,1969,1974,1977,1989,1990,1991,1992,1993,1994,1995,1996,1997,1998,1999,2000,2001,2002,2003,2004,2005,2006,2007,2008,
    2009,2010,2011,2012,2013,2014,2015,2016,2017,2018,2019,2020,2021,2022],"year");
  var gun = get_positions(my_data,gun_per_row,[]);

  var word_count=get_positions(my_data,4,[0,250,1000,2500],"word_count");
  var fk_grade_level=get_positions(my_data,51,[0,250,1000,2500],"word_count");

  // var ch_1_2 = age_class(my_data,two_per_row);
  // var w_ch_1_2 = women_children_class(my_data,two_per_row);
  var coord1=get_positions(my_data,five_per_row,[0,
2,
4,
6,
7,
9,
10,
10,
12,
14,
16,
18,
18,
19,
20,
20,
21,
21,
23,
23,
24,
24,
25,
25,
25,
26,
26,
27,
29,
29,
29,
30,
30,
31,
32,
32,
32,
33,
34,
34,
36,
36,
37,
37,
38,
39,
40,
41,
41,
44,
46
  ],"coord1");

  return {all: all, sex: sex,age: age,p_class:p_class,year:year, coord1:coord1, gun:gun, word_count:word_count, fk_grade_level:fk_grade_level};

  // function women_children_class(my_data,col_per_row){
  //
  //   var positions = [];
  //   var filtered_data = my_data.filter(function(d){
  //     return (d.Age < 15 && d.Pclass < 3) || (d.Sex == "female" && d.Age >= 15 && d.Pclass < 3)
  //   })
  //
  //   positions = positions.concat(populate(filtered_data,"1st or 2nd Class women and children","",col_per_row));
  //   var filtered_data = my_data.filter(function(d){
  //     return (d.Age < 15 && d.Pclass == 3) || (d.Sex == "female" && d.Age >= 15 && d.Pclass == 3) || (d.Sex == "male" && d.Age >= 15)
  //   })
  //   positions = positions.concat(populate(filtered_data,"Remaining Passengers","",col_per_row))
  //   return positions;
  // }
  //
  // function age_class(my_data,col_per_row){
  //   var positions = [];
  //   var filtered_data = my_data.filter(function(d){
  //     return (d.Age < 15 && d.Pclass < 3)
  //   })
  //   positions = positions.concat(populate(filtered_data,"1st or 2nd Class children","",col_per_row));
  //   var filtered_data = my_data.filter(function(d){
  //     return (d.Age < 15 && d.Pclass == 3) || (d.Age >= 15)
  //   })
  //   positions = positions.concat(populate(filtered_data,"Remaining Passengers","",col_per_row))
  //   return positions;
  // }
  //
  // function year_class(my_data,col_per_row){
  //   var positions = [];
  //   // var filtered_data = my_data.filter(function(d){
  //   //   return (d.Age < 15 && d.Pclass < 3)
  //   // })
  //   positions = positions.concat(populate(filtered_data,"1st or 2nd Class children","",col_per_row));
  //   var filtered_data = my_data.filter(function(d){
  //     return (d.Age < 15 && d.Pclass == 3) || (d.Age >= 15)
  //   })
  //   positions = positions.concat(populate(filtered_data,"Remaining Passengers","",col_per_row))
  //   return positions;
  // }

  function get_positions(my_data,col_per_row,variables,field){

    var p_class_labels = {0:"Manifesto*",1:"Journal",2: "Posts",3:"Suicide Note",4:"Other"};
    var positions = [], band = "",p_class="";
    if (variables.length == 0){
      positions = populate(my_data,"","",col_per_row);
    } else {

      for(v in variables){

        var filtered_data = my_data.filter(function(d){
          if(field !== "word_count" & field !== "fk_grade_level" ){
             if(field !== "Pclass9"){
               p_class = p_class_labels[variables[v]]
               coord1=parseInt(variables[v])
             }

             return d[field] == variables[v];

          } else
          {
            // console.error('woc')
            // if (field=='coord1') {
            //
            //   return parseInt(d[field]) == variables[v];
            // }
            // else {
            if(+v == (variables.length-1)){
              // console.error("work");
              band = ">= " + variables[v];
              return d[field] >= variables[v];

            } else {

              band = variables[v] + " - " + variables[+v+1];

              return (d[field] >= variables[v] && d[field] < variables[+v+1]);

            };
          }

          });
          if (field !== "coord1" & (field !=="word_count" & field!=="fk_grade_level")){
        positions = positions.concat(populate(filtered_data,band,p_class,col_per_row));



      }
      else {
        if(field=="word_count" | field=="fk_grade_level"){
          // console.error("woco")

          positions = positions.concat(wordlate(filtered_data,band,p_class,col_per_row));
        }else{
        // console.error("co")

        positions = positions.concat(scatterlate(filtered_data,band,p_class,col_per_row));
        // drawStraightPath(filtered_data);

      }
      }
    }}
    return positions;

  }

  function populate(my_data,band,p_class,col_per_row){

    // my_data = my_data.sort(function(a,b){return d3.descending(a.PassengerId, b.PassengerId)});
    my_data = my_data.sort(function(a,b){return d3.descending(a.shortname, b.shortname)});
    // console.error(my_data)
    var my_row = 0, my_column = 0;
    var sex_labels = {"male": "Men","female": "Women"}
    var current_positions = [];
    for(d in my_data){
      if(isNaN(d) == false){
        if(my_column == col_per_row){
          my_column = 0;
          my_row += 1;
        }
        if(col_per_row==50){my_row=my_data[d].guny*2+10; my_column=my_data[d].gunx*2}
      else{  if(col_per_row==7){my_row=my_row+1-my_column*0.3}}
        ;

        current_positions.push ({
          id: my_data[d].PassengerId,
          row: my_row,
          column: my_column,
          survived: my_data[d].Survived,

          weapon: my_data[d].weapon,
          cluster: my_data[d].cluster,
          location: my_data[d].location,
          motive_cat: my_data[d].motive_cat,

          killed: my_data[d].killed,

          name: my_data[d].name,
          shortname: my_data[d].shortname,
          lname: my_data[d].lname,
          incident_name: my_data[d].incident_name,

          example_color: my_data[d].example_color,
          highlight_color: my_data[d].highlight_color,

          word_count: band,
          fk_grade_level:my_data[d].fk_grade_level,


          age: band,
          sex: sex_labels[my_data[d].Sex],
          all: "all",
          p_class: p_class,
          p_class2: my_data[d].Pclass,
          year: my_data[d].year,
          total: my_data.length,
          coord1: parseInt(my_data[d].coord1),
          coord2: parseInt(my_data[d].coord2),
          ch_1_2: band,
          w_ch_1_2: band
        });
        my_column += 1
      }
    }
    return current_positions;

  }

  function scatterlate(my_data,band,p_class,col_per_row){

    my_data = my_data.sort(function(a,b){return d3.descending(a.PassengerId, b.PassengerId)});
    // console.error("teast")
    var my_row = 0, my_column = 0;
    var sex_labels = {"male": "Men","female": "Women"}
    var current_positions = [];
    for(d in my_data){
      if(isNaN(d) == false){
        if(my_column == col_per_row){
          my_column = 0;
          my_row += 1;
        }
        current_positions.push ({
          id: my_data[d].PassengerId,
          row: my_data[d].coord2*1.2,
          column: my_data[d].coord1,
          survived: my_data[d].Survived,
          killed: my_data[d].killed,

          weapon: my_data[d].weapon,
          cluster: my_data[d].cluster,
          location: my_data[d].location,
          motive_cat: my_data[d].motive_cat,

          shortname: my_data[d].shortname,
          name: my_data[d].name,
          lname: my_data[d].lname,
          incident_name: my_data[d].incident_name,

          example_color: my_data[d].example_color,
          highlight_color: my_data[d].highlight_color,
          word_count: band,
          fk_grade_level:my_data[d].fk_grade_level,


          age: band,
          sex: sex_labels[my_data[d].Sex],
          all: "all",
          p_class: p_class,
          p_class2: my_data[d].Pclass,
          year: my_data[d].year,
          total: my_data.length,
          coord1: parseInt(my_data[d].coord1),
          coord2: parseInt(my_data[d].coord2),
          ch_1_2: band,
          w_ch_1_2: band
        });
        my_column += 1
      }
    }
    return current_positions;

  }

  function wordlate(my_data,band,p_class,col_per_row){

    my_data = my_data.sort(function(a,b){return d3.descending(a.PassengerId, b.PassengerId)});
    // console.error(my_data)
    var my_row = 0, my_column = 0;
    // console.error("teast")
    var sex_labels = {"male": "Men","female": "Women"}
    var current_positions = [];
    // if (col_per_row==51){
    //   my_column=my_data[d].fk_grade_level
    // }
    for(d in my_data){
      if(isNaN(d) == false){
        if(my_column == col_per_row){
          my_column = 0;
          my_row += 1;
        }
        if (col_per_row==51){
          my_row=my_data[d].fk_grade_level*2
        };
        current_positions.push ({
          id: my_data[d].PassengerId,
          row: my_row,
          column: my_column,
          survived: my_data[d].Survived,
          killed: my_data[d].killed,

          weapon: my_data[d].weapon,
          cluster: my_data[d].cluster,
          location: my_data[d].location,
          motive_cat: my_data[d].motive_cat,

          shortname: my_data[d].shortname,
          name: my_data[d].name,
          lname: my_data[d].lname,
          incident_name: my_data[d].incident_name,

          example_color: my_data[d].example_color,
          highlight_color: my_data[d].highlight_color,
          word_count: band,
          fk_grade_level:band,

          age: band,
          sex: sex_labels[my_data[d].Sex],
          all: "all",
          p_class: p_class,
          p_class2: my_data[d].Pclass,
          year: my_data[d].year,
          total: my_data.length,
          coord1: parseInt(my_data[d].coord1),
          coord2: parseInt(my_data[d].coord2),
          ch_1_2: band,
          w_ch_1_2: band
        });
        my_column += 1
      }
    }
    return current_positions;

  }
}

function draw_graph (){
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

svg.selectAll("*").remove();

var color = d3.scaleOrdinal(["#F32424","#3A0088" ,"#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"]);
// console.error(color)

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) { return d.id; }))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 3, height / 2.5));

d3.json("manif.json", function(error, graph) {
  if (error) throw error;

  var link = svg.append("g")
      .attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter().append("line")
      .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

  var node = svg.append("g")
      .attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter().append("g")

  var circles = node.append("circle")
    .attr("r", 6.5)
    .attr("fill", function(d) { return color(d.group); })
    .attr("opacity", function() {
return 0.9
})
    ;

  // Create a drag handler and append it to the node object instead
  var drag_handler = d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);

  drag_handler(node);

  var lables = node.append("text")
      .text(function(d) {
        if(d.id=="Columbine" |
          d.id =="Norway" |
        d.id ==  "El Paso"|
        d.id ==  "Christchurch" |
        d.id ==  "Buffalo"
        // d.id ==  "OKC Bombing"
            ){
        return d.id;}
      })
      .attr('x', 6)
      .attr('y', 3);

  node.append("title")
      .text(function(d) { return d.id; });

  simulation
      .nodes(graph.nodes)
      .on("tick", ticked);

  simulation.force("link")
      .links(graph.links);


  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        })
  }
});

function dragstarted(d) {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
}

function dragged(d) {
  d.fx = d3.event.x;
  d.fy = d3.event.y;
}

function dragended(d) {
  if (!d3.event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
}
};
// draw_graph();
