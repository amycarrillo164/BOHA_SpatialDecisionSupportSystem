# Web App

[Boston Harbor: Coastal Exposure Risk Analysis & Site Selection Tool](https://amycarrillo164.github.io/BOHA_SpatialDecisionSupportSystem/WebApp/index.html "web app")

## Summary

The web application is the host site for everything found inside the github repository. The site includes a brief introduction, map of sea level rise scenarios, map of coastal exposure risk levels, methods for creating the coastal exposure risk layers, mitigation planning site selection tool, and the data sources.

To use the data created or used for the project please email me at @amy.carrillo22\@myhunter.cuny.edu

# Website Data Folder/Files Structure & Notes

```         
Data for leaflet map: 
> geojson_files 
> js_datafiles

Leaflet plugin js files:
> js

CSS/HTML/JS to create website:
> background.html
> coastal_exposure.html
> CE_maps.js
> index.html
> slr.js
> MCE1_methods.html
> pythonapp.html
> data.html
```

# Web App + Dash App

## Instructions for host site & interactive python application set-up:

1.  Download WebApp

2.  Download the dash app folder

3.  Run the python Dash App

4.  Go to WebApp \> MCE1_methods.html

5.  Replace the following line with personal iframe src

    <iframe src="http://127.0.0.1:8050/" width="100%" height="700">

    </iframe>

6.  Refresh website

### Data Folder/Files Structure & Notes

```         
Application Python Code:
> app.py

CSS:
> Assets
    > header.css
    > typography.css

Data:
> FR_Centroids_MCE2_latlong.csv 
```
