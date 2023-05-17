import pandas as pd
import geopandas as gpd
import plotly
import plotly.express as px

import dash
from dash import Dash, html, dcc
import dash_bootstrap_components as dbc
import plotly.graph_objects as go

from dash.dependencies import Input, Output, State  
from dash.exceptions import PreventUpdate

mapbox_access_token = "pk.eyJ1IjoiYW15Y2FycmlsbG8xNjQiLCJhIjoiY2xndmRoc2VjMHA3MTNqa2xpendiamd2eCJ9.Upsr89rAajlIImTICVikzQ"
# px.set_mapbox_access_token(open("pk.eyJ1IjoiYW15Y2FycmlsbG8xNjQiLCJhIjoiY2xndmRoc2VjMHA3MTNqa2xpendiamd2eCJ9.Upsr89rAajlIImTICVikzQ").read())

#use your data!!!
data = pd.read_csv("Dash_intro/data/FR_Centroids_MCE2_latlong.csv")

MCE_df = gpd.read_file("Dash_intro/data/SLR2_MCE_RiskOutputs_poly.geojson")


app = dash.Dash(__name__, external_stylesheets=[dbc.themes.BOOTSTRAP])


app.layout = html.Div(
    children =[
        dcc.Graph(id = 'graph-output', figure = {}),
        dcc.Dropdown(id = 'dropdown_FR', options = ['Natural_Resources','Cultural_Resources', 'Infrastructure_Facilties'], multi=True),
        dcc.Dropdown(id = 'dropdown_Priority', options = ['Low','Medium', 'High'], multi=True),
        #dcc.Input(id = 'input_Gridcode', type = 'number', inputMode = 'numeric', value = '4',
        #          max = 4, min = 1, step = 1),
        html.Button(id='submit_button', n_clicks = 0, children = 'Submit'),
        #html.Div(id = 'output_state')
    ], style = {'text-align': 'center'})


# CALLBACK 1

@app.callback(

    [Output(component_id = 'the_graph', component_property = 'figure')],
    Output(component_id='ouput_state', component_property='options')
    [Input(component_id = 'submit_button', component_property='n_clicks')],
    [State(component_id = 'dropdown_FR', component_property = 'value')]
)

def update_output(num_clicks, val_selected2):
    if val_selected2 is None:
        raise PreventUpdate
    else:
        #df = data.query("year=={}".format(val_selected))
        dff = data.query("Category=={}".format(val_selected2)),
        #df = data.query("Priority=={}".format(val_selected3)),
        #df = data.query("gridcode_2050=={}".format(val_selected4))
        print(type("Category"))

        fig = px.scatter_mapbox(dff,
                                lat="latitude",
                                lon="longitude",
                                # color = "Category",
                                color = "gridcode_2050",
                                hover_name="Descriptio",
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

        return num_clicks, val_selected2, fig


#CALL BACK 2

@app.callback(
    Output(component_id='ouput_state2', component_property='options'),
    [Input(component_id = 'dropdown_Priority', component_property = 'value'),
     Input(component_id='output_state', component_property='value')
    ]
)
    
def update_output(num_clicks, val_selected2, val_selected3):
    if val_selected2 is None:
        raise PreventUpdate
    else:
        df = data.query("Priority=={}".format(val_selected3)),

        fig = px.scatter_mapbox(df,
                                    lat="latitude",
                                    lon="longitude",
                                    # color = "Category",
                                    color = "gridcode_2050",
                                    hover_name="Descriptio",
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
            #fig.update_layout(mapbox_bounds={"west": -71.028897, "east": -70.831599, "south": 42.285887, "north": 42.348372})
        fig.update_layout(mapbox_bounds={"west": -71.035, "east": -70.83, "south": 42.28, "north": 42.36})
            
            # fig.update_layout(title=dict(font=dict(size=28), x=0.5, xanchor = 'center'),
                            #   margin=dict(l=60, r=60, t=50, b=50))
            
            #return('The input SLR Scenario is for 2030. Focal resource(s) selected is/are "{}". Priority selected is/are "{}". Grid code number selected is "{}". The button has been clicked {} times.'.format (val_selected2, val_selected3, val_selected4, num_clicks), fig)
        return('The input SLR Scenario is for 2030. Focal resource(s) selected is/are "{}". Priority selected is/are "{}". The button has been clicked {} times.'.format (val_selected2, val_selected3, num_clicks), fig)

        #return fig
            # return((val_selected2, num_clicks), fig)


if __name__ == '__main__':
    app.run_server(debug = True)