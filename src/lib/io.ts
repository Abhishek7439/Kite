import { useEffect, useState } from "react";


export const config = {
    ip: import.meta.env.VITE_DB_IP || "/api/"
}
var sent = false;
export async function send(x: any) {
l:
    if(!sent)
    {
    sent = true;
    const sen = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(x)
    }
    try {
        const ret = await fetch(config.ip, sen)
        const data = await ret.json()
        console.log(data);
        sent = false;
        return data;
    } 
    catch(error) {
        console.log('ERROR: ', error)
        sent = false;
        return null;
    }
}
else return {error: -2}
}

export function validateEmail(email: string) {
    // Regular expression for validating email addresses
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Test the email against the regular expression
    return regex.test(email);
}

export function isAlphaNum(x: string) {
    
    const regex = /^[a-zA-Z0-9_]/;

    return regex.test(x);
}

export function toImg(x: string, seed?: string) {
    if (!x || x === 'def/pfp') {
        return `https://api.dicebear.com/9.x/glass/svg?seed=${seed || 'KiteUser'}`;
    }
    if (x.startsWith('http')) return x;
    return config.ip + x;
}
export function toBase64(file: File) {
    return new Promise<string | undefined>((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let encoded = reader.result?.toString();
        if (encoded && encoded.length % 4 > 0) {
          encoded += "=".repeat(4 - (encoded.length % 4));
        }
        resolve(encoded);
      };
      reader.onerror = (error) => reject(error);
    });
  }

  export function useIsVisible(ref: any) {
    const [isIntersecting, setIntersecting] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) =>
        setIntersecting(entry.isIntersecting)
      );
  
      observer.observe(ref.current);
      return () => {
        observer.disconnect();
      };
    }, [ref]);
  
    return isIntersecting;
  }