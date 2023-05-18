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

data = pd.read_csv("Dash_intro/data/FR_Centroids_MCE2_latlong.csv")
MCE_df = gpd.read_file("Dash_intro/data/SLR2_MCE_RiskOutputs_poly.geojson")


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
        dcc.Dropdown(id = 'dropdown_FR', options = [
            {'label': 'Natural Resources', 'value': 'Natural_Resources'},
            {'label': 'Cultural Resources', 'value': 'Cultural_Resources'},
            {'label': 'Infrastructure Facilities', 'value': 'Infrastructure_Facilities'}], 
            multi=True, placeholder= "Focal Resource"),
        #dcc.Dropdown(id = 'dropdown_Priority', options = ['Low','Medium', 'High'], multi=True, placeholder="Priority Level"),
        #dcc.Input(id = 'input_Gridcode', type = 'number', inputMode = 'numeric', value = '4',
         #         max = 4, min = 1, step = 1, placeholder= "Coastal Exposure Grid Code"),
        html.Button(id='submit_button', n_clicks = 0, children = 'Submit'),
        #dcc.Checklist(id = "year_checklist", options = [
        #    'CoastalExposure_2030', 'Coastal_Exposure2050', 'Coastal_Exposure2070']),
        html.Div(id = 'output_state')
    ], style = {'text-align': 'center'}),
    ]),

    html.Div([
        dash_table.DataTable(
        columns=[
            {'name': 'Island', 'id': 'Island', 'type': 'text'},
            {'name': 'Focal Resource', 'id': 'Category', 'type': 'text'},
            {'name': 'Description', 'id': 'Descriptio', 'type': 'text'},
            {'name': 'Priority', 'id': 'Priority', 'type': 'text'},
            {'name': 'Coastal Exposure Risk 2030', 'id': 'CoastalExposure_2030', 'type': 'numeric'},
            {'name': 'Coastal Exposure Risk 2050', 'id': 'CoastalExposure_2050', 'type': 'numeric'},
            {'name': 'Coastal Exposure Risk 2070', 'id': 'CoastalExposure_2070', 'type': 'numeric'}
        ],
        data=data.to_dict('records'),
        filter_action='native',

        style_table={
            'height': 200,
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
    #Input(component_id = 'dropdown_Priority', component_property = 'value'),
    #Input(component_id = 'year_checklist', component_property = 'data'),
    State(component_id = 'dropdown_FR', component_property = 'value')],
    #[State(component_id = 'input_Gridcode', component_property = 'value')],
    prevent_initial_call = False,
)


#    if val_selected or val_selected2 is None:
def update_output(num_clicks, val_selected2):
    if val_selected2 is None:
        raise PreventUpdate
    else:
        #df = data.query("year=={}".format(val_selected))
        #df = data.query((['CoastalExposure_2030','CoastalExposure_2050','Coastal_Exposure2070'] == val_selected1) &
                   #(['Priority'] == val_selected2))
        #df = data.query("gridcode_2050=={}".format(val_selected4))
        
        df = data.query("Category=={}".format(val_selected2))
        
        fig = px.scatter_mapbox(df,
                                lat="latitude",
                                lon="longitude",
                                #size = "Priortiy",
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



        # fig = {
        #     "data" : [
        #         scatter_data,
        #         chloropeth_data
        #     ]}                    
                 
        # fig = {
        #     "data" : [
        #         scatter_data,
        #         chloropeth_data
        #     ]}                    

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
        
       
        return('SLR Scenario 2050. Focal resource(s) selected is/are {}. The button has been clicked {} time(s).'.format (val_selected2, num_clicks), fig)
        #return (num_clicks, val_selected2, val_selected3, val_selected4, fig)
# fig = px.choropleth_mapbox(MCE_df,
#                             geojson= MCE_df, 
#                             color="gridcode",
#                             locations="Id", 
#                             # featureidkey="properties.gridcode",
#                             # center={"lat": 45.5517, "lon": -73.7073},
#                             # mapbox_style="carto-positron", zoom=9
#                             )

if __name__ == '__main__':
    app.run_server(debug = True)



