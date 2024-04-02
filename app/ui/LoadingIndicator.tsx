"use client";

import { BarLoader } from "react-spinners";
import { LoadingIndicatorProps } from "../models/UIComponentProps";

/**
 * Renders a loading indicator using the BarLoader component from the react-spinners library.
 *
 * @component
 * @param {LoadingIndicatorProps} props - The component props.
 * @param {boolean} props.loading - Indicates whether the loading indicator should be displayed.
 * @param {string} [props.color] - The color of the loading indicator.
 * @param {number} [props.height] - The height of the loading indicator.
 * @returns {JSX.Element} The rendered LoadingIndicator component.
 */
const LoadingIndicator = ({
  color,
  loading,
  height,
}: LoadingIndicatorProps) => {
  return (
    <div className="flex justify-center items-center">
      <BarLoader color={color} loading={loading} height={height} />
    </div>
  );
};

export default LoadingIndicator;
