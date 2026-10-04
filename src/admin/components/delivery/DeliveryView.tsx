import React, { useState } from 'react';
import { Truck, MapPin, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { DeliveryPerformance } from '../dashboard/DeliveryPerformance';

export const DeliveryView: React.FC = () => {
  const [deliveries, setDeliveries] = useState([
    {
      id: 'DEL-881',
      orderId: '#SB-10248',
      customer: 'রাফি আহমেদ',
      address: 'House 42, Road 11, Banani, Dhaka',
      courier: 'In-House Rider',
      riderName: 'Rahim Mia (#14)',
      riderPhone: '01712-889900',
      status: 'Delivered',
      time: 'Completed in 1h 45m',
    },
    {
      id: 'DEL-882',
      orderId: '#SB-10246',
      customer: 'মো. সাইফুল ইসলাম',
      address: 'Block D, Bashundhara R/A, Dhaka',
      courier: 'Steadfast Courier',
      riderName: 'Faruk Hossain',
      riderPhone: '01811-223344',
      status: 'Out for Delivery',
      time: 'Est. 45 mins remaining',
    },
    {
      id: 'DEL-883',
      orderId: '#SB-10245',
      customer: 'নাসরিন সুলতানা',
      address: 'Sector 7, Uttara, Dhaka',
      courier: 'In-House Rider',
      riderName: 'Karim Ahmed (#08)',
      riderPhone: '01911-556677',
      status: 'Delivered',
      time: 'Completed in 2h 10m',
    },
    {
      id: 'DEL-884',
      orderId: '#SB-10244',
      customer: 'তানভীর হাসান',
      address: 'Avenue 3, Mirpur DOHS, Dhaka',
      courier: 'Pathao Courier',
      riderName: 'Unassigned',
      riderPhone: '-',
      status: 'Processing / Dispatch Ready',
      time: 'Dispatching soon',
    },
  ]);

  return (
    <div className="space-y-5">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-extrabold text-xl text-stone-900 leading-tight">
            Delivery & Courier Logistics (ডেলিভারি ট্র্যাকিং)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Fleet tracking for inside Dhaka (In-House) and nationwide (Steadfast, Pathao, RedX).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200">
            Active Riders: <strong>18 On Duty</strong>
          </span>
        </div>
      </div>

      {/* Grid: Metrics + Live Deliveries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-1">
          <DeliveryPerformance />
        </div>

        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs space-y-3">
          <h3 className="font-display font-bold text-sm text-stone-900">
            সক্রিয় ডেলিভারি সমূহ (Active Delivery Pipeline)
          </h3>

          <div className="divide-y divide-stone-100">
            {deliveries.map((del) => (
              <div key={del.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-stone-900 text-xs">
                      {del.orderId}
                    </span>
                    <span className="text-xs font-bold text-stone-800">
                      • {del.customer}
                    </span>
                    <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.2 rounded">
                      {del.courier}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{del.address}</span>
                  </p>

                  <p className="text-[11px] text-emerald-800 font-medium mt-0.5">
                    রাইডার: {del.riderName} {del.riderPhone !== '-' && `(${del.riderPhone})`}
                  </p>
                </div>

                <div className="sm:text-right shrink-0">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    del.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : del.status === 'Out for Delivery'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {del.status}
                  </span>
                  <p className="text-[10px] text-stone-400 mt-0.5">{del.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
