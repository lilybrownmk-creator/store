import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Store, Truck, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '@/api/orders'
import { formatPrice } from '@/lib/utils'
import { useT } from '@/lib/i18n'
import PWAInstallPrompt from '@/components/shop/PWAInstallPrompt'

export default function CheckoutForm({ open, onClose, cart, onOrderSuccess, orderSuccess }) {
  const t = useT()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [deliveryMethod, setDeliveryMethod] = useState('delivery')
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    delivery_address: '',
    delivery_city: '',
    delivery_postal_code: '',
    notes: '',
  })
  const [giftWrap, setGiftWrap] = useState(false)
  const [giftMessage, setGiftMessage] = useState('')

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)
  const deliveryFee = deliveryMethod === 'pickup' ? 0 : 0 // Промотивно бесплатна достава
  const total = subtotal + deliveryFee
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0)

  const set = patch => setFormData(prev => ({ ...prev, ...patch }))

  // Reset кога се затвора / го зема реферал белешката од localStorage
  useEffect(() => {
    if (open) {
      const bundleNote = localStorage.getItem('zr_bundle_note') || ''
      if (bundleNote) {
        setFormData(prev => ({ ...prev, notes: bundleNote }))
        localStorage.removeItem('zr_bundle_note')
      }
      return
    }

    // Reset при затворање
    setGiftWrap(false)
    setGiftMessage('')
    setFormData({
      customer_name: '', customer_email: '', customer_phone: '',
      delivery_address: '', delivery_city: '', delivery_postal_code: '', notes: '',
    })
  }, [open])

  // Регуларен submit со целосна HTML5 и JS валидација
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (deliveryMethod === 'delivery' && !formData.delivery_address) {
      return toast.error('Ве молиме внесете адреса за достава')
    }

    setLoading(true)

    try {
      const order = await createOrder({
        ...formData,
        delivery_method: deliveryMethod,
        delivery_date: null,
        delivery_address: deliveryMethod === 'pickup' ? '19, Luj Paster str, Skopje 1000' : formData.delivery_address,
        delivery_city: deliveryMethod === 'pickup' ? 'Skopje' : formData.delivery_city,
        delivery_postal_code: deliveryMethod === 'pickup' ? '1000' : formData.delivery_postal_code,
        items: cart.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        delivery_fee: deliveryFee,
        total,
        currency: 'MKD',
        gift_wrap: giftWrap,
        gift_message: giftMessage,
      })

      toast.success('Нарачката е успешно направена!')
      onOrderSuccess?.()
      navigate(`/order-confirmation/${order.id}`)
    } catch (err) {
      toast.error(err.message || 'Настана грешка при креирање на нарачката')
    } finally {
      setLoading(false)
    }
  }

  // Поглед за успешна нарачка
  if (orderSuccess) {
    return (
      <>
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-md bg-[#F5F3F0] border-none rounded-none">
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 border border-[#3D4F3D] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-[#3D4F3D]" />
              </div>
              <p className="text-[10px] text-[#3D4F3D]/60 tracking-[0.2em]">{t('thank_you')}</p>
              <h3 className="text-xl text-[#3D4F3D] tracking-wider">{t('order_confirmed')}</h3>
              <p className="text-[#3D4F3D]/60 text-sm tracking-wide">
                {t('payment_received')}
              </p>
              <Button
                onClick={onClose}
                className="bg-[#3D4F3D] hover:bg-[#2D3F2D] text-white text-xs tracking-[0.2em] px-8 h-12 rounded-none mt-4"
              >
                {t('continue_shopping')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <PWAInstallPrompt show={true} />
      </>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-[#F5F3F0] border-none rounded-none">
        <DialogHeader className="pb-4 border-b border-[#3D4F3D]/10">
          <DialogTitle className="text-[#3D4F3D] text-xs tracking-[0.2em]">{t('delivery_details')}</DialogTitle>
        </DialogHeader>

        {/* Формата овде го управува submit настанот */}
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">

          {/* Опции за достава */}
          <div className="space-y-3">
            <Label className="text-[10px] text-[#3D4F3D]/70 tracking-wider">{t('delivery_method')}</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: 'delivery', icon: Truck, titleKey: 'delivery_label', subKey: 'delivery_sub' },
                { value: 'pickup', icon: Store, titleKey: 'pickup_label', subKey: 'pickup_sub' },
              ].map(opt => (
                <button
                  type="button"
                  key={opt.value}
                  onClick={() => setDeliveryMethod(opt.value)}
                  className={`flex items-center gap-3 p-4 border w-full text-left transition-all ${
                    deliveryMethod === opt.value
                      ? 'border-[#3D4F3D] bg-[#3D4F3D]/5'
                      : 'border-[#3D4F3D]/20 hover:border-[#3D4F3D]/40'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                    deliveryMethod === opt.value ? 'border-[#3D4F3D]' : 'border-[#3D4F3D]/40'
                  }`}>
                    {deliveryMethod === opt.value && (
                      <div className="w-2 h-2 rounded-full bg-[#3D4F3D]" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <opt.icon className="w-4 h-4 text-[#3D4F3D]" />
                      <span className="text-xs tracking-wider text-[#3D4F3D]">{t(opt.titleKey)}</span>
                    </div>
                    <p className="text-[10px] text-[#3D4F3D]/50 mt-1">{t(opt.subKey)}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="bg-white p-3 border border-[#3D4F3D]/10 mt-2">
              {deliveryMethod === 'delivery' ? (
                <>
                  <p className="text-sm text-[#3D4F3D] font-medium">Достава</p>
                  <p className="text-xs text-[#3D4F3D]/70 mt-1">
                    Нарачките се доставуваат во рок од 2–3 работни дена.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-[#3D4F3D] font-medium">Преземање од продавница</p>
                  <p className="text-xs text-[#3D4F3D]/70 mt-1">
                    Луј Пастер 19, 1000 Скопје. Ќе бидете контактирани кога нарачката ќе биде подготвена.
                  </p>
                </>
              )}
            </div>
          </div>

          <Separator className="bg-[#3D4F3D]/10" />

          {/* Податоци за купувачот */}
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label className="text-[10px] text-[#3D4F3D]/70 tracking-wider">{t('full_name')}</Label>
              <Input
                required
                value={formData.customer_name}
                onChange={e => set({ customer_name: e.target.value })}
                className="mt-2 bg-white border-[#3D4F3D]/20 rounded-none h-11 text-[#3D4F3D] focus:border-[#3D4F3D] focus:ring-0"
              />
            </div>
            <div>
              <Label className="text-[10px] text-[#3D4F3D]/70 tracking-wider">{t('phone')}</Label>
              <Input
                type="tel"
                required
                value={formData.customer_phone}
                onChange={e => set({ customer_phone: e.target.value })}
                className="mt-2 bg-white border-[#3D4F3D]/20 rounded-none h-11 text-[#3D4F3D] focus:border-[#3D4F3D] focus:ring-0"
              />
            </div>
            <div>
              <Label className="text-[10px] text-[#3D4F3D]/70 tracking-wider">{t('email')}</Label>
              <Input
                type="email"
                required
                value={formData.customer_email}
                onChange={e => set({ customer_email: e.target.value })}
                className="mt-2 bg-white border-[#3D4F3D]/20 rounded-none h-11 text-[#3D4F3D] focus:border-[#3D4F3D] focus:ring-0"
              />
            </div>

            {deliveryMethod === 'delivery' && (
              <>
                <div className="col-span-2">
                  <Label className="text-[10px] text-[#3D4F3D]/70 tracking-wider">{t('delivery_address')}</Label>
                  <Input
                    required
                    value={formData.delivery_address}
                    onChange={e => set({ delivery_address: e.target.value })}
                    className="mt-2 bg-white border-[#3D4F3D]/20 rounded-none h-11 text-[#3D4F3D] focus:border-[#3D4F3D] focus:ring-0"
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-[#3D4F3D]/70 tracking-wider">{t('city')}</Label>
                  <Input
                    required
                    value={formData.delivery_city}
                    onChange={e => set({ delivery_city: e.target.value })}
                    className="mt-2 bg-white border-[#3D4F3D]/20 rounded-none h-11 text-[#3D4F3D] focus:border-[#3D4F3D] focus:ring-0"
                  />
                </div>
                <div>
                  <Label className="text-[10px] text-[#3D4F3D]/70 tracking-wider">{t('postal_code')}</Label>
                  <Input
                    required
                    value={formData.delivery_postal_code}
                    onChange={e => set({ delivery_postal_code: e.target.value })}
                    className="mt-2 bg-white border-[#3D4F3D]/20 rounded-none h-11 text-[#3D4F3D] focus:border-[#3D4F3D] focus:ring-0"
                  />
                </div>
              </>
            )}

            <div className="col-span-2">
              <Label className="text-[10px] text-[#3D4F3D]/70 tracking-wider">{t('notes_opt')}</Label>
              <Textarea
                value={formData.notes}
                onChange={e => set({ notes: e.target.value })}
                placeholder={t('notes_ph')}
                className="mt-2 bg-white border-[#3D4F3D]/20 rounded-none text-[#3D4F3D] focus:border-[#3D4F3D] focus:ring-0 resize-none placeholder:text-[#3D4F3D]/30 placeholder:text-xs"
                rows={3}
              />
            </div>
          </div>

          {/* Опции за подарок */}
          <div className="space-y-3 border-t border-[#3D4F3D]/10 pt-4 mt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={giftWrap}
                onChange={e => setGiftWrap(e.target.checked)}
                className="w-4 h-4 accent-[#3D4F3D]"
              />
              <div>
                <p className="text-xs text-[#3D4F3D] tracking-[0.1em]">GIFT WRAPPING</p>
                <p className="text-[10px] text-[#3D4F3D]/50">Complimentary gift wrapping</p>
              </div>
            </label>
            {giftWrap && (
              <div>
                <label className="text-[9px] tracking-[0.2em] text-[#3D4F3D]/60 uppercase block mb-1">
                  Gift Message (optional)
                </label>
                <textarea
                  value={giftMessage}
                  onChange={e => setGiftMessage(e.target.value)}
                  placeholder="Write your personal message..."
                  rows={3}
                  className="w-full border border-[#3D4F3D]/20 px-3 py-2 text-xs text-[#3D4F3D] placeholder-[#3D4F3D]/30 focus:outline-none focus:border-[#3D4F3D]/50 resize-none bg-transparent"
                />
              </div>
            )}
          </div>

          <Separator className="bg-[#3D4F3D]/10" />

          {/* Преглед на цена */}
          <div className="bg-white p-4 space-y-3">
            <div className="flex justify-between text-sm text-[#3D4F3D]/70">
              <span className="tracking-wider text-xs">{t('items_count', totalItems)}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-[#3D4F3D]/70">
              <span className="tracking-wider text-xs">
                {deliveryMethod === 'pickup' ? t('pickup_label') : t('delivery_label')}
              </span>
              <span>{deliveryFee === 0 ? t('free') : formatPrice(deliveryFee)}</span>
            </div>
            <Separator className="bg-[#3D4F3D]/10" />
            <div className="flex justify-between text-[#3D4F3D] font-medium">
              <span className="tracking-wider text-xs">{t('total')}</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="p-3 border border-[#3D4F3D]/20 bg-[#3D4F3D]/5 text-center">
            <p className="text-sm font-medium text-[#3D4F3D]">Плаќањето е при достава</p>
          </div>

          {/* Копчето е type="submit" за да се активира HTML5 валидацијата */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3D4F3D] hover:bg-[#2D3F2D] text-white h-12 rounded-none tracking-widest text-xs"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'НАПРАВИ НАРАЧКА'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
