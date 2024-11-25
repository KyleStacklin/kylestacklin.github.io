import React from "react"
import { descriptionParser } from "./RiskOfRainBusinessLogic";
import { createUseStyles } from "react-jss";

const useStyles = createUseStyles({
  description: {
    color: '#fff',
  },
})

type Props = {
  description: string
};

const RiskOfRain2ItemTileDescription = ({ description }: Props) => {
  const styles = useStyles()
  return (
    <div
      className={styles.description}
      dangerouslySetInnerHTML={{ __html: descriptionParser(description) }}
    />
  )
};

export default RiskOfRain2ItemTileDescription;
