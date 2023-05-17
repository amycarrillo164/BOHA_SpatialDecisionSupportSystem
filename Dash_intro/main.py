import pandas as pd
import geopandas as gpd
import plotly
import plotly.express as px

import dash
from dash import Dash, html, dcc
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
            html.Div('Python GUI Application (Plotly Dash)', className="app-header--title")
        ]
    ),

    html.Div(
        children=html.Div([
            html.H2('Mitigation Planning: Focal Resource Site Selection'),
            html.Div('''
                The application uses the coastal exposure risk ratings of Sea Level Rise Scenario 2050.
                The site selection process is dependent on the user's selection of: focal resource category,
                priority level, and coastal exposure gridecode level.
            ''')
        ])
    ),

    html.Div([    
        # html.Div([
            dcc.Graph(id='the_graph')
        ]),

    html.Div([
        dcc.Dropdown(id = 'dropdown_FR', options = ['Natural_Resources','Cultural_Resources', 'Infrastructure_Facilities'], multi=True, placeholder= "Focal Resource"),
        #dcc.Dropdown(id = 'dropdown_Priority', options = ['Low','Medium', 'High'], multi=True, placeholder="Priority Level"),
        #dcc.Input(id = 'input_Gridcode', type = 'number', inputMode = 'numeric', value = '4',
         #         max = 4, min = 1, step = 1, placeholder= "Coastal Exposure Grid Code"),
        html.Button(id='submit_button', n_clicks = 0, children = 'Submit'),
        html.Div(id = 'output_state')
    ], style = {'text-align': 'center'}),
])

@app.callback(
    [Output('output_state','children'),
    Output(component_id = 'the_graph', component_property = 'figure')],
    [Input(component_id ='submit_button', component_property='n_clicks'),
    #Input(component_id = 'dropdown_Priority', component_property = 'value'),
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
        #df = data[(data['Category'] == val_selected2) &
        #           (data['Priority'] == val_selected3)]
        #df = data.query("gridcode_2050=={}".format(val_selected4))
        df = data.query("Category=={}".format(val_selected2))
        
        fig = px.scatter_mapbox(df,
                                lat="latitude",
                                lon="longitude",
                                #size = "Priortiy",
                                color = "gridcode_2050",
                                hover_name="Descriptio",
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
        
        
        return('SLR Scenario 2050. Focal resource(s) selected is/are "{}". The button has been clicked {} times.'.format (val_selected2, num_clicks), fig)
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



