import pandas as pd
import geopandas as gpd
import plotly
import plotly.express as px

import dash
from dash import Dash, html, dcc
import dash_bootstrap_components as dbc
import plotly.graph_objects as go

import copy
from dash.dependencies import Input, Output, State, MATCH  
from dash.exceptions import PreventUpdate

#df = pd.read_table(
#    "https://raw.githubusercontent.com/plotly/datasets/master/global_super_store_orders.tsv"
#)

mapbox_access_token = "pk.eyJ1IjoiYW15Y2FycmlsbG8xNjQiLCJhIjoiY2xndmRoc2VjMHA3MTNqa2xpendiamd2eCJ9.Upsr89rAajlIImTICVikzQ"

df = pd.read_csv("Dash_intro/data/FR_Centroids_MCE2_latlong.csv")

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])

app.layout = dbc.Container([
    html.Div(
        className="app-header",
        children=[
            html.Div('Plotly Dash', className="app-header--title")
        ]
    ),

    html.Div(
        children=html.Div([
            html.H2('Mitigation Planning: Focal Resource Site Selection'),
            html.Div('''
                This python application is powered by plotly dash. The data being used is from the Coastal Exposure Risk Ratings of Sea Level Rise Scenario 2050.
                The mitigation planning site selection process is dependent on the user's choice in focal resource categories. The map displays each focal resource's
                centroid, information on coastal exposure rating (gridcode), and priority levels.
            ''')
        ])
    ),

    html.Div([
        html.Div([
            dcc.Graph(id='the_graph')
        ]),

    html.Div([
        html.H5("Category"),
        dcc.Dropdown(
            id="dropdown_FR", options=sorted(df["Category"].unique())
        ),
        html.H5("Priority"),
        dcc.Dropdown(
            id="dropdown_priority",
            options=sorted(df["Priority"].unique()),
            value=df["Priority"][0]),
        html.Button(id='submit_button', n_clicks = 0, children = 'Submit'),

    ], style = {'text-align': 'center'}),
    ])
])



@app.callback(
    Output("the_graph", "figure"),
    Input("submit_button","n_clicks"),
    Input("dropdown_FR", "value"),
    Input("dropdown_priority", "options")
)

# def chained_callback_country(num_clicks, dropdown_FR, dropdown_priority):

#     dff = copy.deepcopy(df)

#     if dropdown_FR is not None:
#         dff = dff.query("Category == @dropdown_FR")

#     if dropdown_priority is not None:
#          dff = dff.query("Priority == @dropdown_priority")

def chained_callback_country(num_clicks, val_selected2, val_selected3):

    dff = copy.deepcopy(df)

    if val_selected2 is not None:
        dff = dff.query("Category=={}".format(val_selected2))

    if val_selected3 is not None:
         dff = dff.query("Priority=={}".format(val_selected3))

    #return sorted(dff["dropdown_priority"].unique())

    fig = px.scatter_mapbox(dff,
                            lat="latitude",
                            lon="longitude",
                            #size = "Priority",
                            color = "CoastalExposure_2050",
                            range_color=(0,4),
                            #color_continuos_scale = [(0, 'green'), (1, 'green'), (2, 'red'), (3, 'purple'), (4, 'blue')],
                            #opacity = "Priority",
                            # labels = {"title":"Coastal<br>Exposure<br>Rating"},
                            hover_name=("Descriptio"),
                            hover_data=["Priority"],
                        #custom_data = "Category",
                            color_continuous_scale = px.colors.sequential.Bluered,
                            zoom = 5,
                            size_max= 30)

    fig.update_layout(
                mapbox_style="white-bg",
                mapbox_layers=[
                    {
                        "below": 'traces',
                        "sourcetype": "raster",
                        "sourceattribution": "United States Geological Survey",
                        "source": [
                            "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}"
                        ]
                    }
                ])

    fig.update_layout(margin={"r": 0, "t": 0, "l": 0, "b": 0})
    fig.update_layout(mapbox_bounds={"west": -71.035, "east": -70.83, "south": 42.28, "north": 42.36})
            

    #return('The button has been clicked {} time(s).'.format (num_clicks), fig)
    #return('SLR Scenario 2050. Focal resource(s) selected is/are {}. Priority level selected is {}. The button has been clicked {} time(s).'.format (val_selected2, val_selected3, num_clicks), fig)
    
    return fig

if __name__ == '__main__':
    app.run_server(debug = True)