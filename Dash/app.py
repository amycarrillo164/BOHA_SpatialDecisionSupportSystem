# Run this app with `python app.py` and
# visit http://127.0.0.1:8050/ in your web browser.

from dash import Dash, dcc, html
from dash import dash_table
import plotly.graph_objs as go
from dash.dependencies import State, Input, Output
from dash.exceptions import PreventUpdate
import plotly.express as px
from plotly.graph_objs import *
import pandas as pd
import numpy as np
import os
from datetime import datetime as dt

app = Dash(__name__)

app.title = "Focal Resources Site Selection Analysis"
server = app.server

#plotyl mapbox token
mapbox_access_token = "pk.eyJ1IjoiYW15Y2FycmlsbG8xNjQiLCJhIjoiY2xndmRoc2VjMHA3MTNqa2xpendiamd2eCJ9.Upsr89rAajlIImTICVikzQ"


# Dictionary of important locations in New York
list_of_locations = {
    "Lovells":{"lat": 42.329958, "lon": -70.928567},
    "Thompson":{"lat": 42.317916, "lon": -71.007576}, 
    "Long":{"lat": 42.322815, "lon": -70.964917}, 
    "Gallops":{"lat": 42.326117, "lon": -70.939321}, 
    "Peddocks":{"lat": 42.297402, "lon": -70.933620},
    "Georges":{"lat": 42.319979, "lon": -70.928245}, 
    "Little Brewster":{"lat": 42.328001, "lon": -70.890660}, 	
    "Great Brewster":{"lat": 42.332776, "lon": -70.896353}, 
    "Calf":{"lat": 42.341347, "lon": -70.895927}, 
}

# Initialize data frame
df1 = pd.read_csv(
    "https://raw.githubusercontent.com/plotly/datasets/master/uber-rides-data1.csv",
    dtype=object,
)
df2 = pd.read_csv(
    "https://raw.githubusercontent.com/plotly/datasets/master/uber-rides-data2.csv",
    dtype=object,
)
df3 = pd.read_csv(
    "https://raw.githubusercontent.com/plotly/datasets/master/uber-rides-data3.csv",
    dtype=object,
)
df = pd.concat([df1, df2, df3], axis=0)
df["Date/Time"] = pd.to_datetime(df["Date/Time"])
df.index = df["Date/Time"]
df.drop("Date/Time", axis = 1, inplace=True)

totalList = []
for month in df.groupby(df.index.month):
    dailyList = []
    for day in month[1].groupby(month[1].index.day):
        dailyList.append(day[1])
    totalList.append(dailyList)
totalList = (totalList)



# Layout of Dash App
app.layout = html.Div(
    children=[
        html.Div(
            className="row",
            children=[
                # Column for user controls
                html.Div(
                    className="four columns div-user-controls",
                    children=[
                        html.A(
                            html.Img(
                                className="logo",
                                src=app.get_asset_url("dash-logo-new.png"),
                            ),
                            href="https://plotly.com/dash/",
                        ),
                        html.H2("Boston Harbor Focal Resources: Site Selection"),
                        html.P(
                            """Select different sea level rise scenarios (2030, 2050, 2070) and focal resource focus."""
                        ),
                        html.Div(
                            className="div-for-dropdown",
                            children=[
                                dcc.DatePickerSingle(
                                    id="date-picker",
                                    min_date_allowed=dt(2014, 4, 1),
                                    max_date_allowed=dt(2014, 9, 30),
                                    initial_visible_month=dt(2014, 4, 1),
                                    date=dt(2014, 4, 1).date(),
                                    display_format="MMMM D, YYYY",
                                    style={"border": "0px solid black"},
                                )
                            ],
                        ),
                        # Change to side-by-side for mobile layout
                        html.Div(
                            className="row",
                            children=[
                                html.Div(
                                    className="div-for-dropdown",
                                    children=[
                                        # Dropdown for locations on map
                                        dcc.Dropdown(
                                            id="location-dropdown",
                                            options=[
                                                {"label": i, "value": i}
                                                for i in list_of_locations
                                            ],
                                            placeholder="Select a location",
                                        )
                                    ],
                                ),
                                html.Div(
                                    className="div-for-dropdown",
                                    children=[
                                        # Dropdown to select times (before: time of day)
                                        dcc.Dropdown(['Natural Resources','Cultural Resources','Infrastructure/Facilties','All'],'All',
                                            id="bar-selector",
                                            multi=True,
                                            placeholder="Select Focal Resource",
                                        )
                                    ],
                                ),
                            ],
                        ),
                        # html.P(id="total-rides"),
                        # html.P(id="total-rides-selection"),
                        # html.P(id="date-value"),
                        dcc.Markdown(
                            """
                            Source: (https://github.com/fivethirtyeight/uber-tlc-foil-response/tree/master/uber-trip-data)
                            Links: [Source Code](https://github.com/plotly/dash-sample-apps/tree/main/apps/dash-uber-rides-demo) |
                            """
                        ),
                    ],
                ),
                # Column for app graphs and plots
                html.Div(
                    className="eight columns div-for-charts bg-grey",
                    children=[
                        dcc.Graph(id="map-graph"),
                        html.Div(
                            className="text-padding",
                            children=[
                                "Select any of the bars on the histogram to section data by time."
                            ],
                        ),
                        #dcc.Graph(id="histogram"),
                    ],
                ),
            ],
        )
    ]
)

# Gets the amount of days in the specified month
# Index represents month (0 is April, 1 is May, ... etc.)

daysInMonth = [30, 31, 30, 31, 31, 30]

# Get index for the specified month in the dataframe

monthIndex = pd.Index(["Apr", "May", "June", "July", "Aug", "Sept"])

# def get_selection(month, day, selection):
#     xVal = []
#     yVal = []
#     xSelected = []
#     colorVal = [
#         "#F4EC15",
#         "#DAF017",
#         "#BBEC19",
#         "#9DE81B",
#         "#80E41D",
#         "#66E01F",
#         "#4CDC20",
#         "#34D822",
#         "#24D249",
#         "#25D042",
#         "#26CC58",
#         "#28C86D",
#         "#29C481",
#         "#2AC093",
#         "#2BBCA4",
#         "#2BB5B8",
#         "#2C99B4",
#         "#2D7EB0",
#         "#2D65AC",
#         "#2E4EA4",
#         "#2E38A4",
#         "#3B2FA0",
#         "#4E2F9C",
#         "#603099",
#     ]

#     # Put selected times into a list of numbers xSelected
#     xSelected.extend([int(x) for x in selection])

#     for i in range(24):
#         # If bar is selected then color it white
#         if i in xSelected and len(xSelected) < 24:
#             colorVal[i] = "#FFFFFF"
#         xVal.append(i)
#         # Get the number of rides at a particular time
#         yVal.append(len(totalList[month][day][totalList[month][day].index.hour == i]))
#     return [np.array(xVal), np.array(yVal), np.array(colorVal)]


# Selected Data in the Histogram updates the Values in the Hours selection dropdown menu

# @app.callback(
#     Output("bar-selector", "value"),
#     [Input("histogram", "selectedData"), Input("histogram", "clickData")],
# )
# def update_bar_selector(value, clickData):
#     holder = []
#     if clickData:
#         holder.append(str(int(clickData["points"][0]["x"])))
#     if value:
#         for x in value["points"]:
#             holder.append(str(int(x["x"])))
#     return list(set(holder))


# Clear Selected Data if Click Data is used
@app.callback(Output("histogram", "selectedData"), [Input("histogram", "clickData")])
def update_selected_data(clickData):
    if clickData:
        return {"points": []}


# Update the total number of rides Tag
@app.callback(Output("total-rides", "children"), [Input("date-picker", "date")])
def update_total_rides(datePicked):
    date_picked = dt.strptime(datePicked, "%Y-%m-%d")
    return "Total Number of rides: {:,d}".format(
        len(totalList[date_picked.month - 4][date_picked.day - 1])
    )


# Update the total number of rides in selected times
@app.callback(
    [Output("total-rides-selection", "children"), Output("date-value", "children")],
    [Input("date-picker", "date"), Input("bar-selector", "value")],
 )
# def update_total_rides_selection(datePicked, selection):
#     firstOutput = ""

#     if selection != None or len(selection) != 0:
#         date_picked = dt.strptime(datePicked, "%Y-%m-%d")
#         totalInSelection = 0
#         for x in selection:
#             totalInSelection += len(
#                 totalList[date_picked.month - 4][date_picked.day - 1][
#                     totalList[date_picked.month - 4][date_picked.day - 1].index.hour
#                     == int(x)
#                 ]
#             )
#         firstOutput = "Total rides in selection: {:,d}".format(totalInSelection)

#     if (
#         datePicked == None
#         or selection == None
#         or len(selection) == 24
#         or len(selection) == 0
#     ):
#         return firstOutput, (datePicked, " - showing hour(s): All")

#     holder = sorted([int(x) for x in selection])

#     if holder == list(range(min(holder), max(holder) + 1)):
#         return (
#             firstOutput,
#             (
#                 datePicked,
#                 " - showing hour(s): ",
#                 holder[0],
#                 "-",
#                 holder[len(holder) - 1],
#             ),
#         )

#     holder_to_string = ", ".join(str(x) for x in holder)
#     return firstOutput, (datePicked, " - showing hour(s): ", holder_to_string)


# # Update Histogram Figure based on Month, Day and Times Chosen
# @app.callback(
#     Output("histogram", "figure"),
#     [Input("date-picker", "date"), Input("bar-selector", "value")],
# )
# def update_histogram(datePicked, selection):
#     date_picked = dt.strptime(datePicked, "%Y-%m-%d")
#     monthPicked = date_picked.month - 4
#     dayPicked = date_picked.day - 1

#     [xVal, yVal, colorVal] = get_selection(monthPicked, dayPicked, selection)

#     layout = go.Layout(
#         bargap=0.01,
#         bargroupgap=0,
#         barmode="group",
#         margin=go.layout.Margin(l=10, r=0, t=0, b=50),
#         showlegend=False,
#         plot_bgcolor="#323130",
#         paper_bgcolor="#323130",
#         dragmode="select",
#         font=dict(color="white"),
#         xaxis=dict(
#             range=[-0.5, 23.5],
#             showgrid=False,
#             nticks=25,
#             fixedrange=True,
#             ticksuffix=":00",
#         ),
#         yaxis=dict(
#             range=[0, max(yVal) + max(yVal) / 4],
#             showticklabels=False,
#             showgrid=False,
#             fixedrange=True,
#             rangemode="nonnegative",
#             zeroline=False,
#         ),
#         annotations=[
#             dict(
#                 x=xi,
#                 y=yi,
#                 text=str(yi),
#                 xanchor="center",
#                 yanchor="bottom",
#                 showarrow=False,
#                 font=dict(color="white"),
#             )
#             for xi, yi in zip(xVal, yVal)
#         ],
#     )

#     return go.Figure(
#         data=[
#             go.Bar(x=xVal, y=yVal, marker=dict(color=colorVal), hoverinfo="x"),
#             go.Scatter(
#                 opacity=0,
#                 x=xVal,
#                 y=yVal / 2,
#                 hoverinfo="none",
#                 mode="markers",
#                 marker=dict(color="rgb(66, 134, 244, 0)", symbol="square", size=40),
#                 visible=True,
#             ),
#         ],
#         layout=layout,
#     )


# Get the Coordinates of the chosen months, dates and times
def getLatLonColor(selectedData, month, day):
    listCoords = totalList[month][day]

    # No times selected, output all times for chosen month and date
    if selectedData == None or len(selectedData) == 0:
        return listCoords
    listStr = "listCoords["
    for time in selectedData:
        if selectedData.index(time) != len(selectedData) - 1:
            listStr += "(totalList[month][day].index.hour==" + str(int(time)) + ") | "
        else:
            listStr += "(totalList[month][day].index.hour==" + str(int(time)) + ")]"
    return eval(listStr)


# Update Map Graph based on date-picker, selected data on histogram and location dropdown
@app.callback(
    Output("map-graph", "figure"),
    [
        Input("date-picker", "date"),
        Input("bar-selector", "value"),
        Input("location-dropdown", "value"),
    ],
)
def update_graph(datePicked, selectedData, selectedLocation):
    zoom = 12.0
    latInitial = 40.7272
    lonInitial = -73.991251
    bearing = 0

    if selectedLocation:
        zoom = 15.0
        latInitial = list_of_locations[selectedLocation]["lat"]
        lonInitial = list_of_locations[selectedLocation]["lon"]

    date_picked = dt.strptime(datePicked, "%Y-%m-%d")
    monthPicked = date_picked.month - 4
    dayPicked = date_picked.day - 1
    listCoords = getLatLonColor(selectedData, monthPicked, dayPicked)

    return go.Figure(
        data=[
            # Data for all rides based on date and time
            Scattermapbox(
                lat=listCoords["Lat"],
                lon=listCoords["Lon"],
                mode="markers",
                hoverinfo="lat+lon+text",
                text=listCoords.index.hour,
                marker=dict(
                    showscale=True,
                    color=np.append(np.insert(listCoords.index.hour, 0, 0), 23),
                    opacity=0.5,
                    size=5,
                    colorscale=[
                        [0, "#F4EC15"],
                        [0.04167, "#DAF017"],
                        [0.0833, "#BBEC19"],
                        [0.125, "#9DE81B"],
                        [0.1667, "#80E41D"],
                        [0.2083, "#66E01F"],
                        [0.25, "#4CDC20"],
                        [0.292, "#34D822"],
                        [0.333, "#24D249"],
                        [0.375, "#25D042"],
                        [0.4167, "#26CC58"],
                        [0.4583, "#28C86D"],
                        [0.50, "#29C481"],
                        [0.54167, "#2AC093"],
                        [0.5833, "#2BBCA4"],
                        [1.0, "#613099"],
                    ],
                    colorbar=dict(
                        title="Time of<br>Day",
                        x=0.93,
                        xpad=0,
                        nticks=24,
                        tickfont=dict(color="#d8d8d8"),
                        titlefont=dict(color="#d8d8d8"),
                        thicknessmode="pixels",
                    ),
                ),
            ),
            # Plot of important locations on the map
            Scattermapbox(
                lat=[list_of_locations[i]["lat"] for i in list_of_locations],
                lon=[list_of_locations[i]["lon"] for i in list_of_locations],
                mode="markers",
                hoverinfo="text",
                text=[i for i in list_of_locations],
                marker=dict(size=8, color="#ffa0a0"),
            ),
        ],
        layout=Layout(
            autosize=True,
            margin=go.layout.Margin(l=0, r=35, t=0, b=0),
            showlegend=False,
            mapbox=dict(
                accesstoken=mapbox_access_token,
                center=dict(lat=latInitial, lon=lonInitial),  # 40.7272  # -73.991251
                style="dark",
                bearing=bearing,
                zoom=zoom,
            ),
            updatemenus=[
                dict(
                    buttons=(
                        [
                            dict(
                                args=[
                                    {
                                        "mapbox.zoom": 12,
                                        "mapbox.center.lon": "-73.991251",
                                        "mapbox.center.lat": "40.7272",
                                        "mapbox.bearing": 0,
                                        "mapbox.style": "dark",
                                    }
                                ],
                                label="Reset Zoom",
                                method="relayout",
                            )
                        ]
                    ),
                    direction="left",
                    pad={"r": 0, "t": 0, "b": 0, "l": 0},
                    showactive=False,
                    type="buttons",
                    x=0.45,
                    y=0.02,
                    xanchor="left",
                    yanchor="bottom",
                    bgcolor="#323130",
                    borderwidth=1,
                    bordercolor="#6d6d6d",
                    font=dict(color="#FFFFFF"),
                )
            ],
        ),
    )


if __name__ == "__main__":
    app.run_server(debug=True)