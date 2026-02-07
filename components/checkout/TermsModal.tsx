"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export default function TermsModal({ open, onClose, onAccept }: TermsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 py-4 border-b flex flex-row items-center justify-between">
          <DialogTitle className="text-lg font-semibold">Terms & Conditions</DialogTitle>
          {/* <button
            onClick={onClose}
            className="rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button> */}
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] px-6">
          <div className="space-y-6 text-sm text-gray-700">
            {/* শর্ত সমুহ */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3 text-center">শর্ত সমুহ</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  অর্ডার প্লেসের পরে আপনার সাপ্লায়ার থেকে আমাদের চায়না ওয়্যারহাউস পর্যন্ত প্রডাক্ট পৌছানোর ডেলিভারির চার্জ (চায়না লোকাল ডেলিভারি চার্জ) ধার্য হবে।
                </li>
                <li>
                  উল্লেখিত পণ্যের ওজন সম্পূর্ণ সঠিক নয়, আনুমানিক মাত্র। বাংলাদেশে আসার পর পণ্যটির প্রকৃত ওজন পরিমাপ করে শিপিং চার্জ হিসাব করা হবে।
                </li>
                <li>
                  পণ্যের ক্যাটাগরীর উপর নির্ভর করে শিপিং চার্জ নির্ধারণ করা হবে।
                </li>
                <li>
                  প্রোডাক্ট স্ট্যাটাস অন দ্যা ওয়ে টু ডেলিভারি ( বিডি লোকাল ) স্ট্যাটাস হওয়ার পর থেকে পরবর্তী সাত দিনের মধ্যে আফটার সেলস সার্ভিসের জন্য আবেদন বা সাপোর্ট টিকেট ওপেন করতে হবে! অন্যথায় তা গ্রহনযোগ্য হবে না।
                </li>
                <li>
                  ভুল প্রোডাক্ট, রিজেক্ট বা নষ্ট প্রোডাক্ট অথবা প্রোডাক্ট মিসিং সংক্রান্ত সমস্যার সমাধানে আফটার সেলস সার্ভিসটি গ্রহন করে দ্রুত সমাধান পেতে পারেন।
                </li>
                <li>
                  কোনপ্রকার অবৈধ ও নিয়ম বহির্ভূত পণ্য আমদানি করা হবেনা।
                </li>
              </ul>
            </div>

            {/* শিপিং চার্জ */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">শিপিং চার্জ</h3>
              <div className="space-y-4">
                <div>
                  <p className="font-medium mb-2">ক্যাটাগরিঃ এ - ৭৫০ টাকা প্রতি কেজি</p>
                  <p className="text-gray-600">
                    প্রতি কেজি জুতা, ব্যাগ, জুয়েলারী,যন্ত্রপাতি, স্টিকার, ইলেকট্রনিক্স, কম্পিউটার এক্সেসরীস, সিরামিক, ধাতব, চামরা, রাবার,প্লাস্টিক জাতীয় পন্য, ব্যাটারি ব্যাতিত খেলনা।
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-2">ক্যাটাগরিঃ বি - ১১৫০ টাকা প্রতি কেজি</p>
                  <p className="text-gray-600">
                    ব্যাটারি জাতীয় যেকোণ পন্য, ডুপ্লিকেট ব্রান্ড বা কপিঁ পন্য, জীবন্ত উদ্ভিদ, বীজ,রাসায়নীক দ্রব্য,নেটওয়ার্কিং আইটেম, ম্যাগনেট বা লেজার জাতীয় পন্য।
                  </p>
                </div>
                <div>
                  <p className="font-medium mb-2">ক্যাটাগরিঃ সি</p>
                  <p className="text-gray-600">
                    পোশাক বা যেকোন গার্মেন্টস আইটেম - ৭৮০ টাকা, খাদ্যপণ্য - ১২২০ টাকা,কিচেন নাইফ ১২০০,  তরল পণ্য / কসমেটিক্স - ১১৭০ টাকা, শুধু ব্যাটারি বা পাওয়ার ব্যাংক - ১৩৫০ টাকা, হিজাব / ওড়না - ৭৮০ টাকা, পাউডার -ধার ১২২০ টাকা, সানগ্লাস - ৩৫০০ টাকা, সি সি ক্যামেরা - ১৫০০ টাকা, , স্মার্ট ওয়াচ ১২২০ টাকা, সাধারন ঘড়ি - ১১৫০ টাকা, ব্লুটুথ হেডফোন - ১২২০ টাকা।
                  </p>
                </div>
              </div>
            </div>

            {/* রিটার্ন ও রিফান্ড পলিসি */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                🔁 স্কাইবাই — রিটার্ন ও রিফান্ড পলিসি
              </h3>
              <p className="text-gray-600 mb-3">
                স্কাইবাই গ্রাহকের সন্তুষ্টি এবং স্বচ্ছতার প্রতি গভীরভাবে বিশ্বাসী। আমরা সেলার বা উৎপাদক নই, বরং মধ্যস্থতাকারী হিসেবে কাজ করি। তাই পণ্য রিটার্ন বা রিফান্ডের ক্ষেত্রে কিছু নির্দিষ্ট নীতিমালা রয়েছে, যা নিচে বিস্তারিতভাবে উল্লেখ করা হলো:
              </p>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">✅ রিফান্ড প্রযোজ্য হওয়ার শর্ত:</h4>
                  <ul className="space-y-2 list-disc list-inside text-gray-600">
                    <li>
                      <strong>সেলার অর্ডার ক্যানসেল করলে:</strong> অর্ডার Partially Paid হওয়ার পরে যদি কোনো চাইনিজ সেলার স্টক আউট, ভুল তথ্য বা অন্য কোনো কারণে অর্ডার বাতিল করে, তখন গ্রাহকের প্রদত্ত ১০০% অগ্রিম টাকা ফেরত প্রদান করা হবে।
                    </li>
                    <li>
                      <strong>ভুল পণ্য বা কম পণ্য প্রাপ্তি:</strong> যদি সেলার ভুল পণ্য পাঠায় বা নির্ধারিত সংখ্যার কম পণ্য পাঠায়, তবে সেলার থেকে রিফান্ড পাওয়ার পরেই গ্রাহককে রিফান্ড প্রদান করা হবে।
                    </li>
                    <li>
                      <strong>অর্ডার ক্যানসেল (শর্তসাপেক্ষে):</strong> গ্রাহক অর্ডার দেওয়ার পর, পণ্য Purchase Complete স্ট্যাটাস হওয়ার আগ পর্যন্ত পণ্য ক্যানসেল করতে পারবেন। তবে একবার পণ্য Purchase Complete অথবা পণ্য সংগ্রহ হয়ে গেলে বা শিপমেন্ট হয়ে গেলে সেক্ষেত্রে ক্যানসেল বা পরিবর্তন করা সম্ভব নয়।
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">❌ যেসব ক্ষেত্রে রিটার্ন বা রিফান্ড প্রযোজ্য নয়:</h4>
                  <ul className="space-y-2 list-disc list-inside text-gray-600">
                    <li>কোনো পণ্য যদি গ্রাহকের পছন্দ না হয় বা ভুল নির্বাচনের কারণে ফেরত চাওয়া হয়, তবে সেটি গ্রহণযোগ্য হবে না।</li>
                    <li>ভঙ্গুর আইটেমের ক্ষেত্রে আফটার সেলস সার্ভিস প্রযোজ্য নয়। কারন ভঙ্গুর আইটেম যতই ভালো প্যাকাজিং করে শিপমেন্ট করা হোক না কেন সেটি ভেঙ্গে যাওয়ার সম্ভাবনা থাকে।</li>
                    <li>৭ দিনের মধ্যে ডেলিভারি না নিলে কোনো অভিযোগ গ্রাহ্য হবে না: পণ্য আমাদের ওয়্যারহাউসে এসে পৌঁছানোর পর, গ্রাহকের মোবাইলে এসএমএস করা হবে। এরপর ৭ দিনের মধ্যে ডেলিভারি না নিলে সেই পণ্যের বিরুদ্ধে কোনো অভিযোগ গ্রহণ করা হবে না।</li>
                    <li>ইলেকট্রনিক্স পণ্যের গ্যারান্টি বা ওয়ারেন্টি নেই: চাইনিজ সেলারদের থেকে আনা ইলেকট্রনিক পণ্যের ওপর কোনো গ্যারান্টি বা ওয়ারেন্টি দেওয়া হয় না।</li>
                    <li>রঙের পার্থক্য: স্ক্রীনে প্রদর্শিত রঙের সাথে বাস্তব রঙের মধ্যে ৫-১০% পার্থক্য হতে পারে, যা স্বাভাবিক হিসেবে গন্য হবে। স্ক্রীনের রেজোলিউশন অনুযায়ী রঙের পার্থক্য হতে পারে।</li>
                    <li>BSTI অনুমোদিত পণ্যের ক্ষেত্রে: যেসকল পণ্য আমাদানিতে BSTI এর অনুমোদন প্রযোজ্য হয় সেসকল পণ্য আমরা সরাসরি আমদানি করিনা। সেক্ষেত্রে অন্য আমদানিকারকের মাধ্যমে আমদানি করা হবে। (BSTI সার্টিফিকেট শর্ত্যসাপেক্ষে দেওয়া হয়)</li>
                    <li>সেকেন্ড হ্যান্ড বা রিফার্ভিশড পণ্য: অনেক সেলার সেকেন্ড হ্যান্ড বা রিফার্ভিশড পণ্য বিক্রি করে থাকে। এমন পণ্যগুলির জন্য আমাদের কাস্টমার কেয়ারে (09613828606) যোগাযোগ করে বিস্তারিত জেনে অর্ডার করার পরামর্শ দেয়া</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t flex gap-3">
          <Button
            onClick={onClose}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
          >
            Deny
          </Button>
          <Button
            onClick={onAccept}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
          >
            Accept & Place Order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
