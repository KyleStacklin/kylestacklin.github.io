import React from "react"
import { descriptionParser } from "./RiskOfRainBusinessLogic";
import { createUseStyles } from "react-jss";
import clsx from "clsx";

const useStyles = createUseStyles({
  description: {
    color: '#ffffff',
    textAlign: 'left',
  },
})

type Props = {
  className?: string,
  description: string
};

const RiskOfRain2ItemTileDescription = ({ className = '', description }: Props) => {
  const styles = useStyles()

  const descriptionClasses = clsx(
    styles.description,
    {[className]: className}
  )

  return (
    <div
      className={descriptionClasses}
      dangerouslySetInnerHTML={{ __html: descriptionParser(description) }}
    />
  )
};

export default RiskOfRain2ItemTileDescription;
