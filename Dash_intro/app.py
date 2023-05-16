import dash
from dash import html, dcc
import plotly.graph_objects as go
import plotly.express as px
from dash.dependencies import Input, Output  
import pandas as pd


app = dash.Dash()

df = pd.read_csv("Dash_intro/cultural_points.csv")

app.layout = html.Div(id = 'parent', children = [
    html.H1(id = 'H1', children = 'Styling using html components', style = {'textAlign':'center',\
                                            'marginTop':40,'marginBottom':40}),

        dcc.Dropdown( id = 'dropdown',
        options = [
            {'label':'Natural Resources', 'value':'Category' },
            {'label': 'Cultural Resources', 'value':'Category'},
            {'label': 'Infrastructure/Facilties', 'value':'Category'},
            {'label': 'All resources', 'value':'Category'},
            ],
        value = 'ALL'),
        dcc.Graph(id = 'fig3')
    ])
    
    
@app.callback(Output(component_id='fig3', component_property= 'figure'),
              [Input(component_id='dropdown', component_property= 'value')])


def fig_update(dropdown_value):
    print(dropdown_value)
    fig3 = go.Figure(px.scatter_mapbox(
        x = df['Name'],
        lat="Latitude",
        lon="Longitude",
        hover_name="Island",
        hover_data=["NAVD88"],
        color_discrete_sequence=["fuchsia"],
        zoom=3,
        height=300,
        ))
    fig3.update_layout(
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

    fig3.update_layout(margin={"r": 0, "t": 0, "l": 0, "b": 0})
    fig3.update_layout(mapbox_bounds={"west": -71.028897, "east": -70.831599, "south": 42.285887, "north": 42.348372})
    fig3.show()


    return fig3  


if __name__ == '__main__': 
    app.run_server()