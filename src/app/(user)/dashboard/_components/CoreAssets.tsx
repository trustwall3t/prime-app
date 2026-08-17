import Image from 'next/image'
import React from 'react'
const coreAsset = [
  {
    name: 'Alphabet Inc.',
    symbol: 'GOOGL',
    price: '$150',
    imageUrl: '/dashboard/stocks/google.png',
  },
  {
    name: 'Amazon, Inc.',
    symbol: 'AMZN',
    price: '$2,000',
    imageUrl: '/dashboard/stocks/amazon.png',
  },
    {   
    name: 'Apple Inc.',
    symbol: 'AAPL',
    price: '$150',
    imageUrl: '/dashboard/stocks/apple.png',
  },
  {
    name: 'Microsoft ',
    symbol: 'MSFT',
    price: '$300',
    imageUrl: '/dashboard/stocks/microsoft.png',    
  },
  {
    name: 'Tesla, Inc.',
    symbol: 'TSLA',
    price: '$700',
    imageUrl: '/dashboard/stocks/tesla.png',    
  },
  {
    name: 'Meta, Inc.',
    symbol: 'META',
    price: '$250',
    imageUrl: '/dashboard/stocks/meta.png',    
  },
  {
    name: 'NVIDIA co.',
    symbol: 'NVDA',
    price: '$500',
    imageUrl: '/dashboard/stocks/nvidia.png',    
  },
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    price: '$65,000',
    imageUrl: '/dashboard/btc.svg',    
  }
]
const CoreAssets = () => {
  return (
    <>
      {coreAsset.map((asset) => (
        <div className='flex items-center justify-around gap-4 bg-zinc-900 p-4 border-b border-zinc-700 hover:bg-accent-foreground transition-all duration-200 ' key={asset.symbol}>
                                        <div className='flex items-center gap-2'>
                                            <Image
                                                alt='logo'
                                                width={40}
                                                height={50}
                                                src={asset.imageUrl}
                                            />
                                            <div>
                                                <p className='font-semibold text-lg block truncate max-w-xs'>{asset.name}</p>
                                                <p className='text-gray-400 text-sm'>{asset.symbol}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col items-end gap-4'>
                                            <p className='font-semibold text-sm'>US{asset.price}</p>
                                            <span className='bg-green-500 block w-5 h-[2px] rounded-4xl'>
        
                                            </span>
                                        </div>
                                        <div className='max-w-[100px]'>
                                            <svg
                                                viewBox='0 0 1200 300'
                                                className='w-full h-auto'
                                            >
                                                <polyline
                                                    points='50,200 150,130 250,170 350,100 450,50 550,270 650,300 750,180 850,130 950,220 1050,160 1150,190'
                                                    fill='none'
                                                    stroke='#4ade80'
                                                    strokeWidth='2'
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    vectorEffect='non-scaling-stroke'
                                                />
                                            </svg>
                                        </div>
                                    </div>
      ))}
    </>
  )
}

export default CoreAssets