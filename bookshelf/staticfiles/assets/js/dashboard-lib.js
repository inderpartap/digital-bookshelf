var dashboard = (function() {
    return {
        render_general_metrics: function(data_url) {
            d3.json(data_url).then(function(result) {
                var data = result.data;

                var languageRingChart = new dc.PieChart("#chart-ring-language"),
                    categoryRowChart = new dc.RowChart("#chart-row-category"),
                    librarySunburst = new dc.SunburstChart("#chart-sunburst-library"),
                    yearAreaChart = new dc.LineChart("#year-area-chart"),
                    ratingsAreaChart = new dc.LineChart("#ratings-area-chart"),
                    libraryBookTable = new dc_datatables.datatable('.dc-data-table');

                var visCount = dc.dataCount(".dc-data-count");

                // set crossfilter
                var datafilter = crossfilter(data),
                    categoryDim = datafilter.dimension((d) => d.category),
                    floorDim = datafilter.dimension((d) => d.floor),
                    aisleDim = datafilter.dimension((d) => d.aisle),
                    comboDim = datafilter.dimension((d) => [d.floor, d.aisle]),
                    directionDim = datafilter.dimension((d) => d.direction),
                    languageDim = datafilter.dimension((d) => d.language),
                    dataTableDim = datafilter.dimension(d => d.book_id + " " + d.category + " " + d.aisle + " " + d.floor + " " + d.language + " " + d.original_title + " " + d.authors),
                    yearDim = datafilter.dimension(d => Math.round(d.original_publication_year, 0)),
                    ratingsDim = datafilter.dimension((d) => d.average_rating),

                    // set groups
                    categoryGroup = categoryDim.group(),
                    languageGroup = languageDim.group(),
                    floorGroup = floorDim.group(),
                    aisleGroup = aisleDim.group(),
                    yearGroup = yearDim.group(),
                    ratingsGroup = ratingsDim.group(),
                    all = datafilter.groupAll(),

                    //set reduceCounts
                    categoryCount = categoryGroup.reduceCount(),
                    languageCount = languageGroup.reduceCount(),
                    sunburstCategory = comboDim.group().reduceCount(),
                    yearCount = yearGroup.reduceCount(),
                    ratingsCount = ratingsGroup.reduceCount();

                languageRingChart
                    .width(300)
                    .height(300)
                    .dimension(languageDim)
                    .group(languageCount)
                    .innerRadius(50)
                    .controlsUseVisibility(true);

                categoryRowChart
                    .width(515)
                    .height(300)
                    .dimension(categoryDim)
                    .group(categoryCount)
                    .elasticX(true)
                    .renderTitleLabel(true)
                    .titleLabelOffsetX(10)
                    .controlsUseVisibility(true);

                librarySunburst
                    .width(1100)
                    .height(670)
                    .innerRadius(100)
                    .dimension(comboDim)
                    .group(sunburstCategory);

                // .legend(dc.legend());

                // counter how many books are selected, also includes the reset button
                visCount
                    .dimension(datafilter)
                    .group(all);


                yearAreaChart
                    .width(700)
                    .height(330)
                    .x(d3.scaleLinear().domain([1900, 2020]))
                    .margins({ left: 50, top: 10, right: 10, bottom: 40 })
                    .renderArea(true)
                    .brushOn(true)
                    .colors("#ffffff")
                    .dimension(yearDim)
                    .group(yearGroup)
                    .xAxisLabel("Year Published")
                    .yAxisLabel("Book Count");

                ratingsAreaChart
                    .width(700)
                    .height(330)
                    .x(d3.scaleLinear().domain([2.5, 5]))
                    .margins({ left: 50, top: 10, right: 10, bottom: 40 })
                    .renderArea(true)
                    .brushOn(true)
                    .colors("#ffffff")
                    .dimension(ratingsDim)
                    .group(ratingsGroup)
                    .xAxisLabel("Book Rating")
                    .yAxisLabel("Book Count");


                libraryBookTable
                    .dimension(dataTableDim)
                    // (_optional_) max number of records to be shown, `default = 25`
                    .size(10)
                    .columns([{
                            label: "Book ID",
                            format: function(d) { return d.book_id; }
                        },
                        {
                            label: "Book Title",
                            format: function(d) { return d.original_title; }
                        },
                        {
                            label: "Authors",
                            format: function(d) { return d.authors; }
                        },
                        {
                            label: "Publication Year",
                            format: function(d) { return d.original_publication_year; }
                        },
                        {
                            label: "Rating",
                            format: function(d) { return d.average_rating; }
                        },
                        {
                            label: "Category",
                            format: function(d) { return d.category; }
                        },
                        {
                            label: "Language",
                            format: function(d) { return d.language; }
                        },
                        {
                            label: "Floor",
                            format: function(d) { return d.floor; }
                        },
                        {
                            label: "Aisle",
                            format: function(d) { return d.aisle; }
                        }
                    ])
                    .sortBy(function(d) {
                        return d.book_id;
                    })
                    // (_optional_) sort order, `default = d3.ascending`
                    .order(d3.ascending)
                    // (_optional_) custom renderlet to post-process chart using [D3](http://d3js.org)
                    .on('renderlet', function(dataTable) {
                        dataTable.selectAll('.dc-data-table').classed('info', true);
                    })

                // dynamic SEARCH BOX
                var searchBox = new dc.TextFilterWidget("#search").dimension(dataTableDim).placeHolder("Search using any metric");


                dc.renderAll();
                dc.redrawAll();

                function AddXAxis(chartToUpdate, displayText) {
                    chartToUpdate.svg()
                        .append("text")
                        .attr("class", "x-axis-label")
                        .attr("text-anchor", "middle")
                        .attr("x", chartToUpdate.width() / 2)
                        .attr("y", chartToUpdate.height() - 3.5)
                        .text(displayText);
                }
                // AddXAxis(categoryRowChart, "Categories");
            });
        }
    }
})();