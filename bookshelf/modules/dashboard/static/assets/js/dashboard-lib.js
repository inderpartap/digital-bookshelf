var dashboard = (function() {
    return {
        render_general_metrics: function(data_url) {
            d3.json(data_url).then(function(result) {
                var data = result.data;
                console.log(data);

                var languageRingChart = new dc.PieChart("#chart-ring-language"),
                    categoryRowChart = new dc.RowChart("#chart-row-category"),
                    // libraryHeatMap = new dc.HeatMap("#heat-map-library");
                    librarySunburst = new dc.SunburstChart("#chart-sunburst-library");



                // set crossfilter
                var datafilter = crossfilter(data),
                    categoryDim = datafilter.dimension(function(d) { return d.category; }),
                    floorDim = datafilter.dimension(function(d) { return d.floor; }),
                    aisleDim = datafilter.dimension(function(d) { return d.aisle; }),
                    comboDim = datafilter.dimension(function(d) { return [d.floor, d.aisle, d.category]; }),
                    directionDim = datafilter.dimension(function(d) { return d.direction; }),
                    languageDim = datafilter.dimension(function(d) { return d.language_code; }),

                    categoryGroup = categoryDim.group(),
                    languageGroup = languageDim.group(),
                    floorGroup = floorDim.group(),
                    aisleGroup = aisleDim.group(),

                    categoryCount = categoryGroup.reduceCount(),
                    languageCount = languageGroup.reduceCount(),
                    sunburstCategory = comboDim.group().reduceCount();

                console.log(languageGroup.all())
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

                categoryRowChart
                    .dimension(categoryDim)
                    .group(categoryCount)
                    .elasticX(true)
                    .controlsUseVisibility(true);

                librarySunburst
                    .width(768)
                    .height(480)
                    .innerRadius(100)
                    .dimension(comboDim)
                    .group(sunburstCategory)
                    .legend(dc.legend());
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


                dc.renderAll();
            });
        }
    }
})();