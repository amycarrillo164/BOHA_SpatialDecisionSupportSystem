import pandas as pd
import geopandas as gpd
import plotly
import plotly.express as px

import dash
from dash import Dash, html, dcc
from dash import dash_table
from dash.dash_table.Format import Group
import dash_bootstrap_components as dbc
import plotly.graph_objects as go

from dash.dependencies import Input, Output, State, MATCH  
from dash.exceptions import PreventUpdate


mapbox_access_token = "pk.eyJ1IjoiYW15Y2FycmlsbG8xNjQiLCJhIjoiY2xndmRoc2VjMHA3MTNqa2xpendiamd2eCJ9.Upsr89rAajlIImTICVikzQ"

data = pd.read_csv("Dash_App/FR_Centroids_MCE2_latlong.csv")


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
                centroid locations, information on coastal exposure rating (gridcode), and priority levels.
            ''')
        ])
    ),

    html.Div([ 
        html.Div([
        dcc.Dropdown(id = 'dropdown_FR', options = [
            {'label': 'Natural Resources', 'value': 'Natural_Resources'},
            {'label': 'Cultural Resources', 'value': 'Cultural_Resources'},
            {'label': 'Infrastructure Facilities', 'value': 'Infrastructure_Facilities'}], 
            multi=True, placeholder= "Focal Resource"),

        html.Button(id='submit_button', n_clicks = 0, children = 'Submit'),

        html.Div(id = 'output_state')
    ], style = {'text-align': 'center'}),
]),
        html.Div([
            dcc.Graph(id='the_graph')
        ]),

    html.Div([
        dash_table.DataTable(
        columns=[
            {'name': 'Island', 'id': 'Island', 'type': 'text'},
            {'name': 'Focal Resource', 'id': 'Category', 'type': 'text'},
            {'name': 'Description', 'id': 'Descriptio', 'type': 'text'},
            {'name': 'Priority', 'id': 'Priority', 'type': 'text'},
            {'name': 'Risk 2030', 'id': 'CoastalExposure_2030', 'type': 'numeric'},
            {'name': 'Risk 2050', 'id': 'CoastalExposure_2050', 'type': 'numeric'},
            {'name': 'Risk 2070', 'id': 'CoastalExposure_2070', 'type': 'numeric'}
        ],
        data=data.to_dict('records'),
        filter_action='native',

        style_table={
            'height': 400,
        },
        style_data={
            'width': '150px', 'minWidth': '150px', 'maxWidth': '150px',
            'overflow': 'hidden',
            'textOverflow': 'ellipsis',          
        }
    )
])
])

@app.callback(
    [Output('output_state','children'),
    Output(component_id = 'the_graph', component_property = 'figure')],
    [Input(component_id ='submit_button', component_property='n_clicks'),
    State(component_id = 'dropdown_FR', component_property = 'value')],
    prevent_initial_call = False,
)

def update_output(num_clicks, val_selected2):
    if val_selected2 is None:
        raise PreventUpdate
    else:
        df = data.query("Category=={}".format(val_selected2))
        
        fig = px.scatter_mapbox(df,
                                lat="latitude",
                                lon="longitude",
                                color = "CoastalExposure_2050",
                                range_color=(0,4),
                                hover_name=("Descriptio"),
                                hover_data=["Priority"],
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
        
       
        return val_selected2, fig


if __name__ == '__main__':
    app.run_server(debug = True)



