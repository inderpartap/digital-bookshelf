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
                    libraryBookTable = new dc_datatables.datatable('.dc-data-table'),
                    languageStackedChart = new dc.BarChart("#test");



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


                var languageStackGroup = languageDim.group().reduce(
                    function(p, v) {
                        p[v.category] = (p[v.category] || 0) + 1;
                        return p;
                    },
                    function(p, v) {
                        p[v.category] = (p[v.category] || 0) - 1;
                        return p;
                    },
                    function() {
                        return {};
                    });

                function sel_stack(valueKey) {
                    return function(d) {
                        return d.value[valueKey];
                    };
                }
                languageRingChart
                    .width(300)
                    .height(300)
                    .dimension(languageDim)
                    .group(languageCount)
                    .innerRadius(50)
                    .controlsUseVisibility(true)
                    .ordinalColors(['#a8dadc', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51', '#457b9d']);

                languageStackedChart
                    .width(515)
                    .height(300)
                    .x(d3.scaleLinear().domain(languageDim))
                    .dimension(languageDim)
                    .group(languageStackGroup, "Engineering", sel_stack('Engineering'))
                    .xUnits(dc.units.ordinal)
                    .title(function(d) {
                        return this.layer + ' [' + d.key + ']: ' + d.value[this.layer];
                    })
                    .ordinalColors(['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff']);

                //for(var i = 2; i<6; ++i)
                languageStackedChart.stack(languageStackGroup, 'Fiction', sel_stack('Fiction'));
                languageStackedChart.stack(languageStackGroup, 'Math', sel_stack('Math'));
                languageStackedChart.stack(languageStackGroup, 'Self-Help', sel_stack('Self-Help'));
                languageStackedChart.stack(languageStackGroup, 'Computer Science', sel_stack('Computer Science'));
                languageStackedChart.stack(languageStackGroup, 'Design', sel_stack('Design'));
                languageStackedChart.stack(languageStackGroup, 'History', sel_stack('History'));

                categoryRowChart
                    .width(515)
                    .height(300)
                    .dimension(categoryDim)
                    .group(categoryCount)
                    .elasticX(true)
                    .renderTitleLabel(true)
                    .titleLabelOffsetX(10)
                    .controlsUseVisibility(true)
                    .ordinalColors(['#ffadad', '#ffd6a5', '#fdffb6', '#caffbf', '#9bf6ff', '#a0c4ff', '#bdb2ff']);

                librarySunburst
                    .width(1100)
                    .height(670)
                    .innerRadius(100)
                    .dimension(comboDim)
                    .group(sunburstCategory)
                    .ordinalColors(['#CDC9A8', '#E9CCB1', '#836F62', '#C4A691', '#E3D9C5', '#D3C4BE', '#F4EEE1', '#E4BDAC', '#EBCFC4', '#E8E6D9', '#999999', '#CCBAAB']);
                // .ordinalColors(['#FEC5BB', '#FCD5CE', '#fae1dd', '#f8edeb', '#e8e8e4', '#d8e2dc', '#ece4db', '#ffe5d9', '#ffd7ba', '#fec89a', '#E8E6D9', '#EBCFC4'])
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