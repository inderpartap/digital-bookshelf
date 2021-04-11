var dashboard = (function() {


    return {
        render_general_metrics: function(data_url) {
            d3.json(data_url).then(function(result) {
                var data = result.data;
                console.log(data);

                var fmt = d3.format('04d');
                var tFmt = d3.timeFormat("%Y");

                var languageRingChart = new dc.PieChart("#chart-ring-language"),
                    categoryRowChart = new dc.RowChart("#chart-row-category"),
                    // libraryHeatMap = new dc.HeatMap("#heat-map-library");
                    librarySunburst = new dc.SunburstChart("#chart-sunburst-library"),
                    visCount = dc.dataCount(".dc-data-count"),
                    yearAreaChart = new dc.LineChart("#year-area-chart"),
                    ratingsAreaChart = new dc.LineChart("#ratings-area-chart"),
                    libraryBookTable = new dc.DataTable(".dc-data-table");


                // set crossfilter -- set Dimensions
                var datafilter = crossfilter(data),
                    categoryDim = datafilter.dimension((d) => d.category),
                    floorDim = datafilter.dimension((d) => d.floor),
                    aisleDim = datafilter.dimension((d) => d.aisle),
                    comboDim = datafilter.dimension((d) => [d.floor, d.aisle, d.category]),
                    directionDim = datafilter.dimension((d) => d.direction),
                    languageDim = datafilter.dimension((d) => d.language_code),
                    dataTableDim = datafilter.dimension(d => d.book_id),
                    yearDim = datafilter.dimension(d => Math.round(d.original_publication_year, 0)),
                    ratingsDim = datafilter.dimension((d) => d.average_rating),

                
                // set groups
                    categoryGroup = categoryDim.group(),
                    languageGroup = languageDim.group(),
                    floorGroup = floorDim.group(),
                    aisleGroup = aisleDim.group(),
                    yearGroup = yearDim.group(),
                    ratingsGroup = ratingsDim.group()

                // set reduceCounts
                    all = datafilter.groupAll(),
                    categoryCount = categoryGroup.reduceCount(),
                    languageCount = languageGroup.reduceCount(),
                    sunburstCategory = comboDim.group().reduceCount(),
                    yearCount = yearGroup.reduceCount(),
                    ratingsCount = ratingsGroup.reduceCount()

                console.log(languageGroup.all())

                console.log(yearCount.all())


                languageRingChart
                    .width(300)
                    .height(300)
                    .dimension(languageDim)
                    .group(languageCount)
                    .innerRadius(50)
                    .controlsUseVisibility(true);

                // spendHistChart
                //     .dimension(spendDim)
                //     .group(spendHist)
                //     .x(d3.scaleLinear().domain([0, 10]))
                //     .elasticY(true)
                //     .controlsUseVisibility(true);

                // spendHistChart.xAxis().tickFormat(function(d) { return d * 10 }); // convert back to base unit
                // spendHistChart.yAxis().ticks(2);

                // category row chart
                categoryRowChart
                    .dimension(categoryDim)
                    .group(categoryCount)
                    .elasticX(true)
                    .controlsUseVisibility(true);

                // combo sunchart
                librarySunburst
                    .width(768)
                    .height(480)
                    .innerRadius(100)
                    .dimension(comboDim)
                    .group(sunburstCategory)
                    .legend(dc.legend());

                // counter how many books are selected, also includes the reset button
                visCount
                    .dimension(datafilter)
                    .group(all);


                yearAreaChart
                    .width(768)
                    .height(480)
                    .x(d3.scaleLinear().domain([1900, 2020]))
                    .margins({left: 50, top: 10, right: 10, bottom: 20})
                    .renderArea(true)
                    .brushOn(true)
                    .dimension(yearDim)
                    .group(yearGroup)
                    .yAxisLabel("Count of Books")

                ratingsAreaChart
                    .width(768)
                    .height(480)
                    .x(d3.scaleLinear().domain([2.5, 5]))
                    .margins({left: 50, top: 10, right: 10, bottom: 20})
                    .renderArea(true)
                    .brushOn(true)
                    .dimension(ratingsDim)
                    .group(ratingsGroup)
                    .yAxisLabel("Rating out of 5")


                // table chart....pagination needs to be added.
                libraryBookTable
                    .width(300)
                    .height(480)
                    .dimension(dataTableDim)
            // Data table does not use crossfilter group but rather a closure
            // as a grouping function
                    .columns([
                        {
                            label: "Book ID",
                            format: function (d) { return d.book_id; }
                        },
                        {
                            label: "Book Title",
                            format: function (d) { return d.original_title; }
                        },
                        {
                            label: "Authors",
                            format: function (d) { return d.authors; }
                        },
                        {
                            label: "Rating",
                            format: function (d) { return d.average_rating; }
                        },
                        {
                            label: "Floor",
                            format: function (d) { return d.floor; }
                        },
                        {
                            label: "Publication Year",
                            format: function (d) { return d.original_publication_year; }
                        },
                        {
                            label: "Category",
                            format: function (d) { return d.category; }
                        },
                        {
                            label: "Language",
                            format: function (d) { return d.Language; }
                        }
                    ])
                    .size(Infinity)
                    .sortBy(d => d.book_id)
                    .order(d3.ascending);



    
                dc.renderAll();
                // chart
                //     .width(45 * 20 + 80)
                //     .height(45 * 5 + 40)
                //     .dimension(runDim)
                //     .group(runGroup)
                //     .keyAccessor(function(d) { return +d.key[0]; })
                //     .valueAccessor(function(d) { return +d.key[1]; })
                //     .colorAccessor(function(d) { return +d.value; })
                //     .title(function(d) {
                //         return "Run:   " + d.key[0] + "\n" +
                //             "Expt:  " + d.key[1] + "\n" +
                //             "Speed: " + (299000 + d.value) + " km/s";
                //     })
                //     .colors(["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"])
                //     .calculateColorDomain();


                // dc.renderAll();



               
            });
        }
    }





})();

