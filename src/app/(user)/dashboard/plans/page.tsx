'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Plans = () => {
    const router = useRouter();
    const plans = [ 
        {
            id: 1,
            name: 'Starter',
            description: 'Basic plan',
            minPrice: 1000,
            maxPrice: 50000,
            features: ['5% trade commission','10% bonus', '24/7 active support'],
            duration: '1 month',
            interestRate: 22
        },
        {
            id: 2,
            name: 'Tier I',
            description: 'Pro plan',
            minPrice: 51000,
            maxPrice: 100000,
            features: ['5% trade commission', '24/7 active support', '10% bonus'],
            duration: '3 month',
            interestRate: 45.6
        },
        {
            id: 3,
            name: 'Tier II',
            description: 'Enterprise plan',
            minPrice: 101000,
            maxPrice: 500000,
            features: ['5% trade commission', '24/7 active support', '10% bonus'],
            duration: '6 month',
            interestRate: 67.8
        },
        {
            id: 4,
            name: 'Tier III',
            description: 'VIP plan',
            minPrice: 501000,
            maxPrice: 1000000,
            features: ['5% trade commission', '24/7 active support', '10% bonus'],
            duration: '12 month',
            interestRate: 88.5
        }
    ];
    return (
        <div>
            <h1 className="text-2xl font-bold text-center mb-5">Copy Trading Plans</h1>
            <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
                {plans.map((plan) => (
                    <div key={plan.id} className="bg-black   ">
                        <div className="h-[50px]  bg-blue-500 px-4 flex items-center justify-between">
                            <p className="text-white text-sm font-bold">{plan.name} Plan</p>
                            <p className="text-white text-sm font-bold">Duration: {plan.duration}</p>
                        </div>
                        <div className="p-4">
                            <p className="text-white">{plan.description}</p>
                            <div className="flex items-center justify-between">
                                <p>Minimum Price:</p>
                                <p className="text-white font-semibold">${plan.minPrice}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p>Maximum Price:</p>
                                <p className="text-white font-semibold">${plan.maxPrice}</p>
                            </div>
                            <div className="flex items-center justify-between">
                                <p>Interest Rate:</p>
                                <p className="text-white font-semibold">{plan.interestRate}%</p>
                            </div>
                            <div className="">
                               
                                <ul className=" list-inside mt-4 space-y-2">
                                    {plan.features.map((feature) => (
                                        <li key={feature} className="text-white font-medium border-b border-gray-300 ">{feature}</li>
                                    ))}
                                </ul>
                            </div>
                            <Button onClick={() => {
                                router.push('/dashboard/deposit');
                            }} className="w-full mt-4 h-10 bg-blue-500 text-white hover:bg-blue-600  ">Make a Deposit</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Plans;