import { useContext } from "react";
import { UserContext } from "../hook/presaleContext";
import { useQueryClient } from "@sei-js/react";

export const initTime = {
  days: "00",
  hours: "00",
  minutes: "00",
  seconds: "00"
}

export function formatNumber(num) {
    if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + 'T';
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + 'K';
    } else {
        return num.toFixed(2);
    }
}

export function formatFormalNumber(num) {
  if (num >= 1e12) {
      return (num / 1e12).toFixed(0) + 'T';
  } else if (num >= 1e9) {
      return (num / 1e9).toFixed(0) + 'B';
  } else if (num >= 1e6) {
      return (num / 1e6).toFixed(0) + 'M';
  } else if (num >= 1e3) {
      return (num / 1e3).toFixed(0) + 'K';
  } else {
      return num.toFixed(0);
  }
}

export const getWalletBalance = async (connectedWallet, client, address) => {
    // const { connectedWallet } = useWallet();
    // const { queryClient } = useQueryClient();
  
    if (connectedWallet) {
      const balances = await client?.cosmos.bank.v1beta1.allBalances({address});
      return balances;
    } else {
      return 0;
    }
  }
export async function  GetBalance(connectedWallet, address) {
    const { account, setBalance } = useContext(UserContext);
    const { queryClient } = useQueryClient();
   
  try {
    if(connectedWallet || account){
      const balanced = await getWalletBalance(connectedWallet, queryClient, address);
      if (balanced || account) {
        setBalance(Number(balanced.balances[0].amount) / 10 ** 6);
      } else {
        setBalance(10);
      }
    } 
  }catch (e) {
    console.log(e);
  }
}


export function getTimeComponentsFromTimestamp(timestamp) {
  const seconds = timestamp;
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // Format each part to have at least two digits
  const formatNumber = (number) => number.toString().padStart(2, '0');

  return {
      days: formatNumber(days),
      hours: formatNumber(hours),
      minutes: formatNumber(minutes),
      seconds: formatNumber(remainingSeconds)
  };
}


export function convertTimestampToDetailedDate(timestamp) {
  // Create a new Date object from the timestamp (converted to milliseconds)
  const date = new Date(timestamp * 1000);

  // Extracting each component
  const year = date.getFullYear();          // Gets the full year (4 digits)
  const month = date.getMonth() + 1;        // getMonth() returns 0-11; +1 to make it 1-12
  const day = date.getDate();               // Gets the day of the month (1-31)
  const hour = date.getHours();             // Gets the hour (0-23)
  const minute = date.getMinutes();         // Gets the minutes (0-59)
  const second = date.getSeconds();         // Gets the seconds (0-59)

  // Return an object with all components
  return {
      year,
      month: month.toString(), // Ensure two-digit formatting
      day: day.toString(),     // Ensure two-digit formatting
      hour: hour.toString(),   // Ensure two-digit formatting
      minute: minute.toString(), // Ensure two-digit formatting
      second: second.toString()  // Ensure two-digit formatting
  };
}

export function getMonthName(monthNumber) {
  // Create a date object pointing to any day in the specified month
  const date = new Date(2000, monthNumber - 1);  // Year is arbitrary, monthNumber - 1 because JS months are 0-based

  // Use toLocaleString to extract the month name in the default locale
  return date.toLocaleString('en-US', { month: 'long' });
}