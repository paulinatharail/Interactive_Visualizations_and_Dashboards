# Interactive_Visualizations_and_Dashboards


Bubble chart:
--------------
     1) Get the sample object from the /samples/<sample> route.
     5) Plot the bubble chart using:
          sample_values for marker size and y values 
          otu_ids for marker color and x values
          otu_labels for the text


Pie chart:
-----------
     1) Get the sample object from the /samples/<sample> route.
     2) Creates an array of objects for the sample values to preserve the original index number before sorting them in descending order.
     3) Slice the sample_values array to pick the top 10 values sorted in descending order.
     4) Use the original index values of the sorted sample values to extract the otu_id's and otu_labels corresponding to the top 10 sample_values.
     5) Plot the pie chart with the top 10 sample_values, otu_ids and otu_labels.


Metadata:
------------
     1) Get the metadata from the /metatdata/<sample> route.
     2) Use d3 to select the div with id=sample-metadata.
     3) Append a table to the div and for each row in the metatdata, append a table row to display the contents.

Bonus - Gauge chart:
---------------------
     1) Create a new route in the flask app /wfreq/<sample> to list the WFREQ value for a sample.
     2) Get the WFREQ object using d3 from the /wfreq/<sample> route
     3) Modify the gauge plot code from plot.ly documentation to display a gauge meter with 10 section (9 visible, 1 colored white (invisible)) and the pointer to indicate the wash frequence corresponding to WFREQ.





Deploying Flask app to Heroku:
--------------------------------

     Requirements:
     -------------
     1) pip install flask gunicorn
     2) app.py containing the flask application (that needs to be deployed)
     3) run `pip freeze > requirements.txt` to create all the dependencies needed for the flask application
     4) create a Procfile listing all processes needed to run the app (for concurrent requests). In our case, we need only. 
          web: gunicorn app:app

     App is deployed to: https://belly-button-diversity-pp.herokuapp.com