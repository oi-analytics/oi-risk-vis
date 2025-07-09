import { MouseEventHandler } from "react";
import { DataLayerSpec } from "./types";

type NetworkControlProps = {
  onLayerVisChange: MouseEventHandler<HTMLInputElement>;
  dataLayers: Array<DataLayerSpec>;
};

const NetworkControl = (props: NetworkControlProps) => (
  <>
    {props.dataLayers.map((layer_data) => {
      const layer = layer_data.key;
      const label = layer_data.label;
      return (
        <div className="form-check" key={"toggleLayer" + layer}>
          <input
            className="form-check-input"
            type="checkbox"
            data-layer={layer}
            defaultChecked={true}
            id={"toggleLayerCheckbox" + layer}
            onClick={props.onLayerVisChange}
          />
          <span
            className={layer_data.linear ? "dot line" : "dot"}
            style={{ backgroundColor: layer_data.color }}
          ></span>
          <label
            className="form-check-label"
            htmlFor={"toggleLayerCheckbox" + layer}
          >
            {label}
          </label>
        </div>
      );
    })}
  </>
);

export default NetworkControl;
