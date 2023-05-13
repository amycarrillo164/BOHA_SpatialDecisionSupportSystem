import pandas as pd
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
data = pd.read_csv("Dash_intro/data/practice_fr_data.csv")

# options = [
#     {'NR','CR', 'INFRA'},
#     {'NR'},
#     {'CR'},
#     {'INFRA'},
#     {'NR','CR'},
#     {'NR', 'INFRA'},
#     {'CR','INFRA'},
# ]

app = dash.Dash(__name__, external_stylesheets=[dbc.themes.SIMPLEX])

app.layout = dbc.Container([
    dbc.Row([
        dbc.Col([
            html.H1("Focal Resources Site Selection ", style={'textAlign':'center'})
        ], width=12)
    ]),

    # html.Div([    
    #     html.Div([
    #         dcc.Graph(id='the_graph')
    #     ]),
    # ]),

    # dbc.Row[(
    #     dbc.Col([
    #         # html.Div([
    #             dcc.Graph(id='the_graph')
    #             # ]), 
    #         ])               
    # )],

#     dbc.Row[(
#         dbc.Col([
#             html.Label('Dropdown'),
#             dcc.Dropdown(id = 'dropdown_FR', options = ['NR','CR', 'INFRA'], multi=True),
#             html.Button(id='submit_button', n_clicks = 0, children = 'Submit'),
#             html.Div(id = 'output_state')
#         ], style = {'text-align': 'center'}),
#     )],
# ]),

    html.Div([    
        html.Div([
            dcc.Graph(id='the_graph')
        ]),

    html.Div([
        #dcc.Input(id = 'input_SLRScenario', type = 'number', inputMode = 'numeric', value = 2030,
        #          max = 2070, min = 2030, step = 20, required = True),
        #dcc.Input(id = 'input_FocalResource', type = 'text', value = ('NR','CR', 'INFRA'),
        #          required=True),
        dcc.Dropdown(id = 'dropdown_FR', options = ['NR','CR', 'INFRA'], multi=True),
        html.Button(id='submit_button', n_clicks = 0, children = 'Submit'),
        html.Div(id = 'output_state')
    ],style = {'text-align': 'center'}),
])

])

@app.callback(
    [Output('output_state','children'),
     Output(component_id = 'the_graph', component_property = 'figure')],
    [Input(component_id = 'submit_button', component_property='n_clicks')],
    #[State(component_id = 'input_SLRScenario', component_property = 'value')]
    [State(component_id = 'dropdown_FR', component_property = 'value')]
)

#def update_output(num_clicks, val_selected, val_selected2):
#    if val_selected or val_selected2 is None:
def update_output(num_clicks, val_selected2):
    if val_selected2 is None:
        raise PreventUpdate
    else:
        #df = data.query("year=={}".format(val_selected))
        df = data.query("Category=={}".format(val_selected2))
        
        fig = px.scatter_mapbox(df,
                                lat="Latitude",
                                lon="Longitude",
                                color = "gridcode_2030",
                                hover_name="Descriptio",
                                #hover_data = "Island",
                                color_continuous_scale = px.colors.cyclical.IceFire,
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
        fig.update_layout(mapbox_bounds={"west": -71.2, "east": -70.5, "south": 42.25, "north": 42.4})
        
        # fig.update_layout(title=dict(font=dict(size=28), x=0.5, xanchor = 'center'),
                        #   margin=dict(l=60, r=60, t=50, b=50))
        
        return('The input SLR Scenario was ... Focal resource(s) selected is/are "{}". The button has been clicked {} times.'.format (val_selected2, num_clicks), fig)
        # return((val_selected2, num_clicks), fig)


if __name__ == '__main__':
    app.run_server(debug = True)






# df = pd.read_csv("Dash_intro/cultural_points.csv")

# dcc.Dropdown(id='indicator_dropdown',
#              value='GINI index (World Bank estimate)',
#              options=[{'label': indicator, 'value': indicator}
#                       for indicator in poverty.columns[3:54]])

# dcc.Graph(id='indicator_map_chart')

# def multiline_indicator(indicator):
#     final = []
#     split = indicator.split()
#     for i in range(0, len(split), 3):
#         final.append(' '.join(split[i:i+3]))
#     return '<br>'.join(final)

# @app.callback(Output('indicator_map_chart', 'figure'),
#               Input('indicator_dropdown', 'value'))

# def display_generic_map_chart(indicator):
#     df = poverty[poverty['is_country']]
#     fig = px.choropleth(df,
#                         locations='Country Code',
#                         color=indicator,
#                         title=indicator,
#                         hover_name='Country Name',
#                         color_continuous_scale='cividis',
#                         animation_frame='year',
#                         height=650)
#     fig.layout.geo.showframe = False
    
#     fig.layout.coloraxis.colorbar.title =\
# multiline_indicator(indicator)

#app.run_server(mode='inline', height=200, port=8050)