# OIA Risk Visualisation Tool

This project provides interactive data visualisations of risk analysis results.

The tool presents the infrastructure systems and hazards considered in the
analysis, then presents results as modelled for the whole system at a fine
scale.

The concepts and model results presented here are documented in the
study report:

> Pant, R., Russell, T., Glasgow, G., Verschuur, J., Gavin, H., Fowler, T. &
> Hall, J.W. (2021). Analytics for Financial Risk Management of Critical
> Infrastructure in Southeast Asia – Final Report. Oxford Infrastructure
> Analytics Ltd., Oxford, UK. Available online at:
> [thedocs.worldbank.org/en/doc/1019bd2696cf0660968910763351f601-0240012021/analytics-for-financial-risk-management-of-critical-infrastructure-in-southeast-asia-scoping-feasibility-study](https://thedocs.worldbank.org/en/doc/1019bd2696cf0660968910763351f601-0240012021/analytics-for-financial-risk-management-of-critical-infrastructure-in-southeast-asia-scoping-feasibility-study)

Results are archived in the World Bank Data Catalog:

- [Southeast Asia transport network](https://datacatalog.worldbank.org/search/dataset/0042426/South-East-Asia-transport-network)
- [Southeast Asia electric grid](https://datacatalog.worldbank.org/search/dataset/0042425/South-East-Asia-electric-grid)
- [Southeast Asia strong wind hazard - tropical cyclone](https://datacatalog.worldbank.org/search/dataset/0042422/South-East-Asia-strong-wind-hazard--tropical-cyclone-)
- [Southeast Asia strong wind risk - tropical cyclone](https://datacatalog.worldbank.org/search/dataset/0050606/South-East-Asia-strong-wind-risk--tropical-cyclone-)
- [Southeast Asia coastal flood hazard](https://datacatalog.worldbank.org/search/dataset/0042424/South-East-Asia-coastal-flood-hazard)
- [Southeast Asia coastal flood risk](https://datacatalog.worldbank.org/search/dataset/0050607/South-East-Asia-coastal-flood-risk)
- [Southeast Asia river flood hazard](https://datacatalog.worldbank.org/search/dataset/0042423/South-East-Asia-river-flood-hazard)
- [Southeast Asia river flood risk](https://datacatalog.worldbank.org/search/dataset/0050609/South-East-Asia-river-flood-risk)

The Southeast Asia analytics are produced using the code here:

- [github.com/oi-analytics/seasia](https://github.com/oi-analytics/seasia)

## Features

### Summarise risk analysis at an admin-1 regional scale

![Nghe An summary](images/nghe-an.png)

### See an overview of infrastructure networks

![Networks](images/networks-all.png)

### Zoom in to see networks in detail

![Networks in detail](images/networks-zoom.png)

### See an overview of hazard data

![Hazards](images/hazards-all.png)

### Inspect details of hazard layers

![Hazards in detail](images/hazard-zoom.png)

### Query attributes of elements of the system

![System attributes](images/road-zoom-alt.png)

### Range of potential economic impacts of failure

Consisting of direct damages to infrastructure assets and indirect economic
losses resulting from infrastructure service disruption (loss of power, loss of
access):

![Impact of flooding](images/risk-total.png)

### Cost-benefit analysis

In the Vietnam case study (and in
[version 0.1 of this tool](https://github.com/oi-analytics/oi-risk-vis/releases/tag/v0.1-argentina)
showing analysis done in Argentina), explore a cost-benefit analysis (under
uncertainty, with options to explore some parameters) of adaptation measures:

![Cost-benefit analysis of adaptation measures](images/cost-benefit.png)

## Development

This README covers requirements and steps through how to prepare data for
visualisation and how to run the tool.

1. Data preparation requirements
2. Prepare data
3. Build and run requirements
4. Run

### Data preparation requirements

#### ogr2ogr

[ogr2ogr](https://www.gdal.org/ogr2ogr.html) is used for spatial data
processing. On Ubuntu, run:

    sudo apt-get install gdal-bin

#### Tippecanoe

The data preparation steps use
[Mapbox tippecanoe](https://github.com/mapbox/tippecanoe) to build vector tiles
from large feature sets.

The easiest way to install tippecanoe on OSX is with Homebrew:

    brew install tippecanoe

On Ubuntu it will usually be easiest to build from the source repository:

    sudo apt-get install build-essential g++ libsqlite3-dev zlib1g-dev
    git clone https://github.com/mapbox/tippecanoe
    cd tippecanoe
    make -j
    make

### Prepare data

This step is not necessary if you already have a prepared set MBTiles files -
the simplest option is to place them directly in the `/data` folder.

Otherwise, to prepare results of analysis for visualisation in this tool, you
will need to build a set of MBTiles files which contain the data as Mapbox
Vector Tiles for the map visualisations, and a set of CSV files for the charts.

Download `boundaries`, `network` and `flood_data` `usage` `results` from the
shared folder.

Either link to the synced/downloaded data directories:

    ln -s 'path/to/results' incoming_data/results

Or unzip within `/incoming_data` folder:

    unzip ~/Downloads/boundaries.zip -d incoming_data/
    unzip ~/Downloads/network.zip -d incoming_data/

Convert the incoming data to JSON files first:

    python scripts/files_to_json_for_vis.py

Create the \*.pmtiles files for visualisation:

    make

### Build and run requirements

#### Node and npm

The build and run steps use [node.js](https://nodejs.org/) - this provides the
`npm` command.

Install required packages. Run from the project root:

    npm install

### Run

Running the application in development mode:

    npm run dev

This should automatically open a browser tab. If not, open:

    firefox http://localhost:5173/

### Deployment

Build the application:

    npm run build

The `dist` folder should then have everything needed for a static site
deployment, e.g. behind a web server, or from an object store.

For example, configure an AWS S3 bucket to host a static website
([docs](https://docs.aws.amazon.com/AmazonS3/latest/userguide/HostingWebsiteOnS3Setup.html)),
then upload `dist` to the bucket:

    aws s3 cp --recursive dist s3://bucket-name

## Acknowledgments

This tool was originally developed by Oxford Infrastructure Analytics as part of
a project led by the Disaster Risk Financing and Insurance Program (DRFIP) of
the World Bank with support from the Japan&mdash;World Bank Program for
Mainstreaming DRM in Developing Countries, which is financed by the Government
of Japan and managed by the Global Facility for Disaster Reduction and Recovery
(GFDRR) through the Tokyo Disaster Risk Management Hub.
