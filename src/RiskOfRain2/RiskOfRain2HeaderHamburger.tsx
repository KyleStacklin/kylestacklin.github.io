import React from "react"

type Props = {
  expanded: boolean;
  onClick: () => void;
};

const RiskOfRain2HeaderHamburger = ({ expanded, onClick }: Props) => {
  return (
    <>
      { expanded ?
        (
          <svg onClick={onClick} style={{cursor: 'pointer'}} width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM7 12C7 11.4477 7.44772 11 8 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H8C7.44772 13 7 12.5523 7 12ZM13 18C13 17.4477 13.4477 17 14 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H14C13.4477 19 13 18.5523 13 18Z" fill="#ffffff"/>
          </svg>
        ) :
        (
          <svg onClick={onClick} style={{cursor: 'pointer'}} width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 18L20 18" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
            <path d="M4 12L20 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
            <path d="M4 6L20 6" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        )
      }
    </>
  )
};

export default RiskOfRain2HeaderHamburger;
