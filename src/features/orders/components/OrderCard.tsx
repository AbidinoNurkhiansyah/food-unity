import React, { useState, useEffect } from 'react';
import { formatCurrency } from "@/lib/utils";
import { Clock, CheckCircle2, XCircle, QrCode, MapPin, Copy, Check, ChevronDown } from "lucide-react";
import QRCode from "react-qr-code";
import { db } from "@/config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface Order {
  orderId: string;
  items: any[];
  total: number;
  status: string;
  snapToken?: string;
  createdAt: string;
}

interface OrderCardProps {
  order: Order;
  onPayNow: (snapToken?: string) => void;
  onCancelClick: (orderId: string) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({ order, onPayNow, onCancelClick }) => {
  const [showQR, setShowQR] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedShort, setCopiedShort] = useState(false);
  const [merchantData, setMerchantData] = useState<{
    businessName: string;
    address: string;
    lat?: number;
    lng?: number;
  } | null>(null);
  const [productImages, setProductImages] = useState<Record<string, string>>({});

  const isExpired = order.items.some((item: any) => {
    if (!item.pickupDeadline) return false;
    return new Date(item.pickupDeadline).getTime() <= Date.now();
  });

  const firstProductItem = order.items.find(item => item.id !== "FEE-01" && item.merchantId);
  const merchantId = firstProductItem?.merchantId;
  const deadlineDate = firstProductItem?.pickupDeadline
    ? new Date(firstProductItem.pickupDeadline)
    : null;

  // Fetch Merchant Details
  useEffect(() => {
    if (!merchantId) return;

    const fetchMerchant = async () => {
      try {
        const docRef = doc(db, "users", merchantId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const bizName = data.profile?.businessName || data.name || "Merchant";
          const addr = data.profile?.address;
          const fullAddr = addr
            ? `${addr.detail || ""}, ${addr.districtName || ""}, ${addr.regencyName || ""}`.replace(/^,\s*/, "")
            : "Address not available";

          setMerchantData({
            businessName: bizName,
            address: fullAddr,
            lat: data.profile?.address?.lat,
            lng: data.profile?.address?.lng
          });
        }
      } catch (err) {
        console.error("Error fetching merchant:", err);
      }
    };

    fetchMerchant();
  }, [merchantId]);

  // Fetch Product Images
  useEffect(() => {
    const fetchImages = async () => {
      const imagesMap: Record<string, string> = {};
      const fetchPromises = order.items
        .filter(item => item.id && item.id !== "FEE-01")
        .map(async (item) => {
          try {
            const docRef = doc(db, "products", item.id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data.imageUrl) {
                imagesMap[item.id] = data.imageUrl;
              }
            }
          } catch (err) {
            console.error("Error fetching product image:", err);
          }
        });

      await Promise.all(fetchPromises);
      setProductImages(imagesMap);
    };

    fetchImages();
  }, [order.items]);

  const handleCopyId = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(order.orderId);
    setCopiedId(true);
    toast.success("Order ID copied to clipboard!");
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyShort = () => {
    navigator.clipboard.writeText(shortCode);
    setCopiedShort(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedShort(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    if (status === "PAID" && isExpired) {
      return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-semibold border border-red-200"><XCircle size={14} /> Expired (Uncollected)</span>;
    }
    switch (status) {
      case "PENDING":
        return <span className="flex items-center gap-1 text-yellow-600 bg-yellow-50 px-2 py-1 rounded-md text-xs font-semibold border border-yellow-200"><Clock size={14} /> Unpaid</span>;
      case "PAID":
        return <span className="flex items-center gap-1 text-palette-600 bg-palette-50 px-2 py-1 rounded-md text-xs font-semibold border border-palette-200"><CheckCircle2 size={14} /> Paid</span>;
      case "FAILED":
        return <span className="flex items-center gap-1 text-red-600 bg-red-50 px-2 py-1 rounded-md text-xs font-semibold border border-red-200"><XCircle size={14} /> Failed/Cancelled</span>;
      default:
        return <span className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded-md text-xs font-semibold border border-gray-200">{status}</span>;
    }
  };

  const shortCode = order.orderId.split('-').pop() || order.orderId.substring(order.orderId.length - 6);

  // Summarize items for the collapsed view
  const productItems = order.items.filter(item => item.id !== "FEE-01");
  const itemSummary = productItems.length > 0
    ? productItems.length === 1
      ? `${productItems[0].name} x${productItems[0].quantity}`
      : `${productItems[0].name} x${productItems[0].quantity} +${productItems.length - 1} more`
    : "No items";

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <Accordion type="single" collapsible>
          <AccordionItem value={order.orderId} className="border-none">

            {/* ── Collapsed Header (always visible) ── */}
            <AccordionTrigger className="w-full px-4 pt-4 pb-3 hover:no-underline [&>svg]:hidden group/trigger">
              <div className="flex flex-col w-full gap-2">
                {/* Row 1: Order ID + status + date */}
                <div className="flex flex-wrap justify-between items-center gap-2 w-full">
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold shrink-0">Order ID</p>
                    <button
                      onClick={handleCopyId}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer shrink-0"
                      title="Copy Order ID"
                    >
                      {copiedId ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                    </button>
                    <p className="text-xs font-medium text-gray-700 truncate max-w-[140px] sm:max-w-xs">{order.orderId}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <p className="text-xs text-gray-400 hidden sm:block">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>

                {/* Row 2: Merchant + item summary + total + chevron */}
                <div className="flex flex-wrap justify-between items-center gap-2 w-full">
                  <div className="flex flex-col min-w-0">
                    {merchantData && (
                      <p className="text-sm font-semibold text-gray-800 truncate">{merchantData.businessName}</p>
                    )}
                    <p className="text-xs text-gray-400 truncate">{itemSummary}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <p className="text-base font-bold text-primary-600">{formatCurrency(order.total)}</p>
                    <ChevronDown
                      size={16}
                      className="text-gray-400 transition-transform duration-200 group-data-[state=open]/trigger:rotate-180"
                    />
                  </div>
                </div>
              </div>
            </AccordionTrigger>

            {/* ── Expanded Detail ── */}
            <AccordionContent className="pb-0">
              <div className="border-t border-gray-100">

                {/* Merchant Info */}
                {merchantData && (
                  <div className="px-4 py-3 bg-gray-50/40 border-b border-gray-100 flex flex-wrap justify-between items-center gap-3 text-sm">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="p-1.5 bg-primary-50 rounded-lg text-primary-500 shrink-0">
                        <MapPin size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-800 truncate">{merchantData.businessName}</p>
                        <p className="text-xs text-gray-500 truncate">{merchantData.address}</p>
                      </div>
                    </div>
                    {merchantData.lat && merchantData.lng && (
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${merchantData.lat},${merchantData.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 rounded-lg text-xs font-semibold border border-gray-200 transition-colors cursor-pointer ml-auto sm:ml-0 shrink-0"
                      >
                        Directions
                      </a>
                    )}
                  </div>
                )}

                <div className="p-4">
                  {/* Pickup Deadline Banner */}
                  {deadlineDate && order.status !== "FAILED" && (
                    <div className={`mb-4 flex items-center gap-2 text-xs rounded-xl px-3 py-2.5 border ${
                      isExpired
                        ? "bg-red-50 text-red-800 border-red-100"
                        : "bg-amber-50 text-amber-800 border-amber-100"
                    }`}>
                      <Clock size={14} className={isExpired ? "text-red-500" : "text-amber-500"} />
                      <span className="font-medium">
                        {isExpired
                          ? `Pickup deadline passed at: `
                          : `Please pick up before: `}
                        <strong>
                          {deadlineDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </strong>
                      </span>
                    </div>
                  )}

                  {/* Item List */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item: any, idx: number) => {
                      const imageUrl = productImages[item.id];
                      return (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <div className="flex items-center gap-3">
                            {item.id !== "FEE-01" ? (
                              <div className="relative h-10 w-10 bg-gray-50 rounded-md overflow-hidden shrink-0 border border-gray-100 shadow-sm flex items-center justify-center">
                                <img
                                  src={imageUrl || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=600&auto=format&fit=crop"}
                                  alt={item.name}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute -top-1.5 -right-1.5 h-4 min-w-4 px-1 rounded-full bg-palette-600 text-white text-[9px] font-bold flex items-center justify-center border border-white">
                                  {item.quantity}
                                </span>
                              </div>
                            ) : (
                              <div className="h-10 w-10 bg-gray-50 rounded-md flex items-center justify-center font-semibold text-gray-500 border border-gray-100 text-xs shrink-0">
                                Fee
                              </div>
                            )}
                            <span className="font-medium text-gray-700">{item.name}</span>
                          </div>
                          <span className="text-gray-600">{formatCurrency(item.price * item.quantity)}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Footer: Total + Actions */}
                  <div className="pt-4 border-t border-gray-100 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Total Payment</p>
                      <p className="text-lg font-bold text-primary-600">{formatCurrency(order.total)}</p>
                    </div>

                    {order.status === "PENDING" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onCancelClick(order.orderId)}
                          className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                        >
                          Cancel Order
                        </button>
                        <button
                          onClick={() => onPayNow(order.snapToken)}
                          disabled={!order.snapToken}
                          className="px-6 py-2 bg-gradient-to-r from-primary-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/30 transition-[opacity,box-shadow] duration-200 ease-out disabled:opacity-50"
                        >
                          {order.snapToken ? "Pay Now" : "Token Expired"}
                        </button>
                      </div>
                    )}

                    {order.status === "PAID" && !isExpired && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowQR(true)}
                          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-palette-500 to-teal-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-[box-shadow] duration-200 ease-out"
                        >
                          <QrCode size={18} />
                          Pickup Ticket
                        </button>
                      </div>
                    )}

                    {order.status === "PAID" && isExpired && (
                      <span className="text-xs font-semibold text-red-500 bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
                        Pickup Deadline Passed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </AccordionContent>

          </AccordionItem>
        </Accordion>
      </div>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">Pickup Ticket</DialogTitle>
            <DialogDescription className="text-center">
              Show this QR Code to the cashier or store staff to retrieve your food.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-6 space-y-6">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <QRCode value={order.orderId} size={200} />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1 flex items-center justify-center gap-1.5">
                <span>Unique Code / Order ID</span>
                <button
                  onClick={handleCopyShort}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  title="Copy Unique Code"
                >
                  {copiedShort ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                </button>
              </p>
              <p className="text-2xl font-mono font-bold tracking-widest text-palette-600">{shortCode}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
