.PHONY: all clean

all: ./data/rail.pmtiles ./data/roads_main.pmtiles ./data/roads_other.pmtiles ./data/electricity.pmtiles

./data/rail.pmtiles:
	tippecanoe \
		--minimum-zoom=3 \
		--maximum-zoom=15 \
		--output=./data/rail.pmtiles \
		--layer=rail \
		./intermediate_data/Rail/*.json

./data/roads_main.pmtiles:
	tippecanoe \
		--minimum-zoom=3 \
		--maximum-zoom=15 \
		--drop-smallest-as-needed \
		--output=./data/roads_main.pmtiles \
		./intermediate_data/Roads/highway/trunk.json \
		./intermediate_data/Roads/highway/motorway.json \
		./intermediate_data/Roads/highway/primary.json \
		./intermediate_data/Roads/highway/secondary.json

./data/roads_other.pmtiles:
	tippecanoe \
		--minimum-zoom=3 \
		--maximum-zoom=15 \
		--drop-densest-as-needed \
		--output=./data/roads_other.pmtiles \
		--layer=other \
		--read-parallel \
		./intermediate_data/Roads/highway/tertiary.json \
		./intermediate_data/Roads/highway/other_*.json

./data/electricity.pmtiles:
	tippecanoe \
		--minimum-zoom=3 \
		--maximum-zoom=15 \
		--drop-smallest-as-needed \
		--output=./data/electricity.pmtiles \
		--layer=electricity \
		./intermediate_data/Electricity/*.geobuf

./data/coastal.pmtiles:
	tippecanoe \
		--minimum-zoom=3 \
		--maximum-zoom=15 \
		--drop-rate=1 \
		--cluster-distance=1 \
		--accumulate-attribute=depth_m:max \
		--output=./data/coastal.pmtiles \
		--layer=coastal \
		./intermediate_data/Flooding/coastal_100yr.csv

./data/fluvial.pmtiles:
	tippecanoe \
		--minimum-zoom=3 \
		--maximum-zoom=15 \
		--drop-rate=1 \
		--cluster-distance=1 \
		--accumulate-attribute=depth_m:max \
		--output=./data/fluvial.pmtiles \
		--layer=fluvial \
		./intermediate_data/Flooding/fluvial_100yr.csv

./data/cyclone.pmtiles:
	tippecanoe \
		-zg \
		--output=./data/cyclone.pmtiles \
		--layer=cyclone \
		./intermediate_data/Cyclone/cyclone_100yr.json

clean:
	rm -f ./data/*.pmtiles

./intermediate_data/Cyclone/cyclone_100yr.json:
	gdal_polygonize.py Cyclone_100yr.tif -f "GeoJSONSeq" cyclone_100yr.json cyclone gust_speed_ms-1
