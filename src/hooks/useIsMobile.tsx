    import { useState, useEffect } from 'react'

    export default function useIsMobile(): boolean {
      const [isMobile, setIsMobile] = useState<boolean>(false)

      useEffect(() => {
        const handleResize = () => {
          setIsMobile(window.innerWidth < 768) // Define your mobile breakpoint
        }

        handleResize() // Initial check
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
      }, [])

      return isMobile
    }