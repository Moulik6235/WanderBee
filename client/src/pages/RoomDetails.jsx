import React, { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { roomsDummyData } from '../assets/quickStay-assets/assets'
import { useAppContext } from '../context/AppContext'
import { toast } from 'react-hot-toast'

const RoomDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { axios, currency, getToken } = useAppContext()
    const [room, setRoom] = useState(null)
    const [bookingDate, setBookingDate] = useState({
        checkIn: "2026-10-12",
        checkOut: "2026-10-15",
        guests: 2
    })

    // Stitch property details for dynamic rich content mapping
    const stitchProperties = useMemo(() => [
      {
        name: "The Maharana's Lake Retreat",
        address: "Old City, Udaipur, Rajasthan",
        city: "Udaipur",
        rating: 4.9,
        reviewsCount: 240,
        type: "Palace Hotel",
        price: 12500,
        about: "Experience majestic views of Pichola Lake and Lake Palace from this historic 18th-century sanctuary of the Mewar rulers. Meticulously restored to its original splendor, it features exquisite marble carvings, crystal chandeliers, hand-painted frescoes, and world-class royal dining, delivering the signature 'Atithi Devo Bhava' service.",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuARK86bQhppCPH3GLs4FM9czrEDFWlrxPzwBkJ3BqQYMLUQl0gha4A8vliiWWj1xmXO6x6-L9_nqtVId3YGX-Do0csB_i4s7SNFfzADXK2N4EBR2QyWXeL_4YYM5kr9zTPNJE8j_zFoK-A_SiS57VfMKfdSayWBC_63wwQKZ1BKWE1Ldehh00G2e8bJ8AIbXwSzBGMaBqanZRGiwkwYRYvO2O6IuN_oOS44uD3UUadKXP6uycFqSd0QQs1bpPzqSDqQZ0h80lwQSjvI",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuA_ZYqirc6aOsriRZ6YZ2yYaIPt5W-uagipa9Zne5l-h7aNa7bgx0dJ92VCGr52PBxwUUMHBzi1xULXEZP1KE9hUBlFKBZei-q-4BoHTLGLAeCtW32UuBp1JLD1ZmCODEPgJqkE5THzj13inswULn-3KcG80OPcilxxP6FgMbukrYKFsniij3QVjXrXuNcAODcOWzde9RZzUM7I6RnJUtd0W_0gqqWgw_wJVBXfcZJalFr5fdTcAPofArgMYblGU3C2AvVOfjUYOnSr",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBY9TfYTQd55PQEfwQIQDHMpdNGa38-RkOQ4v8oncrb1lYcGrNdD8ULF9pD7L7KPS1U41Lb0ycDC7A29ojVs4XxiYRTJfkmfYXIlWbN7M0kc6rctXOCdiYbY8Fb3j5hTAkUinnWQomYHeHWOwaZy8n88gVaumAkfIuc5Ai9jD3tQ7KuJimPQkfJq64nQ1Hx2k4qxbzGwK8Rhi3bspthW28xGszBhXk8GSm4A3wYeUym2qq0uF4pJwKWc_MDqz9uK2grIYrSaiWle8Wy",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuD9rmuOj5iWmWeJucgaxzlcgax4VI7caas8PUTwdrI0-5ZTw7s58TUoJzSGhS_bqTU5LGsUDGAqhGXYK5HIiueDAI4G_5uuI81won73xQzS8U_z71uBXFdd5UlzakF-wOUSm0WYwu7e9iZ_ApUf3PXvxiQjn0K3_RXVgQ_uooPylgorRlpotNVxF9co-b9NqRtzZSzgrAS8S0T_cM2JN0CVAQR_npC4jZoU-UdcFvCN6dViHPfbD6S6YXeC8WekWxx6qyylqDz_1tdw"
        ],
        amenities: ["Swimming Pool", "Free WiFi", "Spa & Wellness", "Royal Dining"]
      },
      {
        name: "Aravalli Boutique Haveli",
        address: "Fateh Sagar Lake, Udaipur, Rajasthan",
        city: "Udaipur",
        rating: 4.7,
        reviewsCount: 180,
        type: "Heritage Haveli",
        price: 8900,
        about: "Perched beautifully near Fateh Sagar Lake against the dramatic backdrop of the Aravalli hills, this boutique heritage home combines traditional architecture with bespoke modern luxury. Rest in beautifully curated suites adorned with local Rajasthani art, vintage fabrics, and hand-carved stone pillars.",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBN9iaHyFAXfWWZtCWdzoBn0yRbqD8bp8UW7w7DTBVfyfgWbZhvFhpCFBRbYK80O5311zUJ5ValbdxNDfQsUYg4hHcTJhDizzn-XLZ_hpJhSQTqR-YDsMuIA2CZaS5jm0FGOgdOdR_ANlhb-Rp64X6Pv3Lo-x_lb1cd_RkjyJ7N9B9cjg4LJXzOX0oGHjIIK079crEak7G-bxfsH5-Jm1rRJXBv0WzD3Op3wEUAgTEhcuhedokDjz93Mfh325Ari2AnKi2tzl93pUQ2",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDpfDnnoxRLnX9Z1MXeB31XFJLClZI41FYwzdn-u_y0Ww2Ev95ew52gSrW-NhAWDTpIelfx0mkWYk-lOKC76TQ_Yl5AAticlNsmOGkO2OdV0Kh-z-Y74hbc1znxZToPSH3XCt1HygtlDUQ2kNXOYc0ryLAOn8fwVLJ52nXY0b2CJ-HiVeDfJR0ZOdhjE7tybzjnu5u0jwr9Y9wfYH94t0hzbi4csbL1Tys6EdK_fEDPyUMFk05DcBA68wqpV2va_6T-muRDCutb-9Id",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuA_ZYqirc6aOsriRZ6YZ2yYaIPt5W-uagipa9Zne5l-h7aNa7bgx0dJ92VCGr52PBxwUUMHBzi1xULXEZP1KE9hUBlFKBZei-q-4BoHTLGLAeCtW32UuBp1JLD1ZmCODEPgJqkE5THzj13inswULn-3KcG80OPcilxxP6FgMbukrYKFsniij3QVjXrXuNcAODcOWzde9RZzUM7I6RnJUtd0W_0gqqWgw_wJVBXfcZJalFr5fdTcAPofArgMYblGU3C2AvVOfjUYOnSr",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBY9TfYTQd55PQEfwQIQDHMpdNGa38-RkOQ4v8oncrb1lYcGrNdD8ULF9pD7L7KPS1U41Lb0ycDC7A29ojVs4XxiYRTJfkmfYXIlWbN7M0kc6rctXOCdiYbY8Fb3j5hTAkUinnWQomYHeHWOwaZy8n88gVaumAkfIuc5Ai9jD3tQ7KuJimPQkfJq64nQ1Hx2k4qxbzGwK8Rhi3bspthW28xGszBhXk8GSm4A3wYeUym2qq0uF4pJwKWc_MDqz9uK2grIYrSaiWle8Wy"
        ],
        amenities: ["Free WiFi", "Royal Dining", "Room Service", "Mountain View"]
      },
      {
        name: "The Grand Mewar Resort & Spa",
        address: "Sajjangarh Road, Udaipur, Rajasthan",
        city: "Udaipur",
        rating: 4.8,
        reviewsCount: 310,
        type: "Boutique Resort",
        price: 14200,
        about: "Surround yourself with premium Mewari hospitality and wellness therapies on the edge of the Sajjangarh Wildlife Sanctuary. Rejuvenate with state-of-the-art spa programs, fine Indian specialty cuisine, and infinity-edge pools that frame the scenic hills and valleys of Southern Rajasthan.",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCs412SxoaVyKZxiFp-87VIFHY9BEQOwNl4OVpxf-kPCs5MhSRn-y1MgarWxt1ZFSTxGnBytuy1xwmQmbxUn3y5VOHuyA4MGT0SsA2oclMgcLaI3NezgkI0kntkGMEhSoRcFn3K-8ZkJeQvWpuUEUf882LBvaEm_IEffAf2X69mWXEsVkozmG2McSHqKfQqUaFUYgmIv3MNlo1OHIRp4Ncq_oOnQ86CcWBrTpGJDotX0Pd9zCBbzimTfF-ZztmcOht5evZsTk40GUng",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBY9TfYTQd55PQEfwQIQDHMpdNGa38-RkOQ4v8oncrb1lYcGrNdD8ULF9pD7L7KPS1U41Lb0ycDC7A29ojVs4XxiYRTJfkmfYXIlWbN7M0kc6rctXOCdiYbY8Fb3j5hTAkUinnWQomYHeHWOwaZy8n88gVaumAkfIuc5Ai9jD3tQ7KuJimPQkfJq64nQ1Hx2k4qxbzGwK8Rhi3bspthW28xGszBhXk8GSm4A3wYeUym2qq0uF4pJwKWc_MDqz9uK2grIYrSaiWle8Wy",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDpfDnnoxRLnX9Z1MXeB31XFJLClZI41FYwzdn-u_y0Ww2Ev95ew52gSrW-NhAWDTpIelfx0mkWYk-lOKC76TQ_Yl5AAticlNsmOGkO2OdV0Kh-z-Y74hbc1znxZToPSH3XCt1HygtlDUQ2kNXOYc0ryLAOn8fwVLJ52nXY0b2CJ-HiVeDfJR0ZOdhjE7tybzjnu5u0jwr9Y9wfYH94t0hzbi4csbL1Tys6EdK_fEDPyUMFk05DcBA68wqpV2va_6T-muRDCutb-9Id",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuA_ZYqirc6aOsriRZ6YZ2yYaIPt5W-uagipa9Zne5l-h7aNa7bgx0dJ92VCGr52PBxwUUMHBzi1xULXEZP1KE9hUBlFKBZei-q-4BoHTLGLAeCtW32UuBp1JLD1ZmCODEPgJqkE5THzj13inswULn-3KcG80OPcilxxP6FgMbukrYKFsniij3QVjXrXuNcAODcOWzde9RZzUM7I6RnJUtd0W_0gqqWgw_wJVBXfcZJalFr5fdTcAPofArgMYblGU3C2AvVOfjUYOnSr"
        ],
        amenities: ["Swimming Pool", "Spa & Wellness", "Royal Dining", "Room Service"]
      },
      {
        name: "Udaipur Heritage Palace",
        address: "Near City Palace, Udaipur, Rajasthan",
        city: "Udaipur",
        rating: 4.4,
        reviewsCount: 95,
        type: "Luxury Suite",
        price: 6500,
        about: "Step inside this majestic retreat situated right adjacent to the royal City Palace complex. Indulge in classic Rajput elegance, private courtyard swings, rooftop views of Lake Pichola, and standard amenities that elevate your cultural stays into unforgettable heritage experiences.",
        images: [
            "https://lh3.googleusercontent.com/aida-public/AB6AXuDpfDnnoxRLnX9Z1MXeB31XFJLClZI41FYwzdn-u_y0Ww2Ev95ew52gSrW-NhAWDTpIelfx0mkWYk-lOKC76TQ_Yl5AAticlNsmOGkO2OdV0Kh-z-Y74hbc1znxZToPSH3XCt1HygtlDUQ2kNXOYc0ryLAOn8fwVLJ52nXY0b2CJ-HiVeDfJR0ZOdhjE7tybzjnu5u0jwr9Y9wfYH94t0hzbi4csbL1Tys6EdK_fEDPyUMFk05DcBA68wqpV2va_6T-muRDCutb-9Id",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuA_ZYqirc6aOsriRZ6YZ2yYaIPt5W-uagipa9Zne5l-h7aNa7bgx0dJ92VCGr52PBxwUUMHBzi1xULXEZP1KE9hUBlFKBZei-q-4BoHTLGLAeCtW32UuBp1JLD1ZmCODEPgJqkE5THzj13inswULn-3KcG80OPcilxxP6FgMbukrYKFsniij3QVjXrXuNcAODcOWzde9RZzUM7I6RnJUtd0W_0gqqWgw_wJVBXfcZJalFr5fdTcAPofArgMYblGU3C2AvVOfjUYOnSr",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuBY9TfYTQd55PQEfwQIQDHMpdNGa38-RkOQ4v8oncrb1lYcGrNdD8ULF9pD7L7KPS1U41Lb0ycDC7A29ojVs4XxiYRTJfkmfYXIlWbN7M0kc6rctXOCdiYbY8Fb3j5hTAkUinnWQomYHeHWOwaZy8n88gVaumAkfIuc5Ai9jD3tQ7KuJimPQkfJq64nQ1Hx2k4qxbzGwK8Rhi3bspthW28xGszBhXk8GSm4A3wYeUym2qq0uF4pJwKWc_MDqz9uK2grIYrSaiWle8Wy",
            "https://lh3.googleusercontent.com/aida-public/AB6AXuCs412SxoaVyKZxiFp-87VIFHY9BEQOwNl4OVpxf-kPCs5MhSRn-y1MgarWxt1ZFSTxGnBytuy1xwmQmbxUn3y5VOHuyA4MGT0SsA2oclMgcLaI3NezgkI0kntkGMEhSoRcFn3K-8ZkJeQvWpuUEUf882LBvaEm_IEffAf2X69mWXEsVkozmG2McSHqKfQqUaFUYgmIv3MNlo1OHIRp4Ncq_oOnQ86CcWBrTpGJDotX0Pd9zCBbzimTfF-ZztmcOht5evZsTk40GUng"
        ],
        amenities: ["Free WiFi", "Room Service", "Mountain View"]
      }
    ], [])

    useEffect(() => {
        const fetchRoomData = async () => {
            // 1. Try finding in custom luxury mock rooms first (Udaipur, Jaipur, Jodhpur properties)
            const luxuryMockRooms = [
                {
                  _id: "ud-1",
                  name: "The Mewar Grand Heritage",
                  city: "Udaipur",
                  address: "Lake Pichola, Udaipur, Rajasthan",
                  rating: 4.9,
                  reviewsCount: 342,
                  type: "Heritage Stays",
                  pricePerNight: 18500,
                  originalPrice: 24000,
                  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuARK86bQhppCPH3GLs4FM9czrEDFWlrxPzwBkJ3BqQYMLUQl0gha4A8vliiWWj1xmXO6x6-L9_nqtVId3YGX-Do0csB_i4s7SNFfzADXK2N4EBR2QyWXeL_4YYM5kr9zTPNJE8j_zFoK-A_SiS57VfMKfdSayWBC_63wwQKZ1BKWE1Ldehh00G2e8bJ8AIbXwSzBGMaBqanZRGiwkwYRYvO2O6IuN_oOS44uD3UUadKXP6uycFqSd0QQs1bpPzqSDqQZ0h80lwQSjvI",
                  images: [
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuARK86bQhppCPH3GLs4FM9czrEDFWlrxPzwBkJ3BqQYMLUQl0gha4A8vliiWWj1xmXO6x6-L9_nqtVId3YGX-Do0csB_i4s7SNFfzADXK2N4EBR2QyWXeL_4YYM5kr9zTPNJE8j_zFoK-A_SiS57VfMKfdSayWBC_63wwQKZ1BKWE1Ldehh00G2e8bJ8AIbXwSzBGMaBqanZRGiwkwYRYvO2O6IuN_oOS44uD3UUadKXP6uycFqSd0QQs1bpPzqSDqQZ0h80lwQSjvI",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_ZYqirc6aOsriRZ6YZ2yYaIPt5W-uagipa9Zne5l-h7aNa7bgx0dJ92VCGr52PBxwUUMHBzi1xULXEZP1KE9hUBlFKBZei-q-4BoHTLGLAeCtW32UuBp1JLD1ZmCODEPgJqkE5THzj13inswULn-3KcG80OPcilxxP6FgMbukrYKFsniij3QVjXrXuNcAODcOWzde9RZzUM7I6RnJUtd0W_0gqqWgw_wJVBXfcZJalFr5fdTcAPofArgMYblGU3C2AvVOfjUYOnSr",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBY9TfYTQd55PQEfwQIQDHMpdNGa38-RkOQ4v8oncrb1lYcGrNdD8ULF9pD7L7KPS1U41Lb0ycDC7A29ojVs4XxiYRTJfkmfYXIlWbN7M0kc6rctXOCdiYbY8Fb3j5hTAkUinnWQomYHeHWOwaZy8n88gVaumAkfIuc5Ai9jD3tQ7KuJimPQkfJq64nQ1Hx2k4qxbzGwK8Rhi3bspthW28xGszBhXk8GSm4A3wYeUym2qq0uF4pJwKWc_MDqz9uK2grIYrSaiWle8Wy",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuD9rmuOj5iWmWeJucgaxzlcgax4VI7caas8PUTwdrI0-5ZTw7s58TUoJzSGhS_bqTU5LGsUDGAqhGXYK5HIiueDAI4G_5uuI81won73xQzS8U_z71uBXFdd5UlzakF-wOUSm0WYwu7e9iZ_ApUf3PXvxiQjn0K3_RXVgQ_uooPylgorRlpotNVxF9co-b9NqRtzZSzgrAS8S0T_cM2JN0CVAQR_npC4jZoU-UdcFvCN6dViHPfbD6S6YXeC8WekWxx6qyylqDz_1tdw"
                  ],
                  amenities: ["Swimming Pool", "Free WiFi", "Breakfast Included"],
                  about: "Experience majestic views of Pichola Lake and Lake Palace from this historic 18th-century sanctuary of the Mewar rulers. Meticulously restored to its original splendor, it features exquisite marble carvings, crystal chandeliers, hand-painted frescoes, and world-class royal dining, delivering the signature 'Atithi Devo Bhava' service."
                },
                {
                  _id: "ud-2",
                  name: "Indigo Vista Boutique Hotel",
                  city: "Udaipur",
                  address: "City Centre, Udaipur, Rajasthan",
                  rating: 4.7,
                  reviewsCount: 188,
                  type: "Boutique Hotels",
                  pricePerNight: 9200,
                  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBN9iaHyFAXfWWZtCWdzoBn0yRbqD8bp8UW7w7DTBVfyfgWbZhvFhpCFBRbYK80O5311zUJ5ValbdxNDfQsUYg4hHcTJhDizzn-XLZ_hpJhSQTqR-YDsMuIA2CZaS5jm0FGOgdOdR_ANlhb-Rp64X6Pv3Lo-x_lb1cd_RkjyJ7N9B9cjg4LJXzOX0oGHjIIK079crEak7G-bxfsH5-Jm1rRJXBv0WzD3Op3wEUAgTEhcuhedokDjz93Mfh325Ari2AnKi2tzl93pUQ2",
                  images: [
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBN9iaHyFAXfWWZtCWdzoBn0yRbqD8bp8UW7w7DTBVfyfgWbZhvFhpCFBRbYK80O5311zUJ5ValbdxNDfQsUYg4hHcTJhDizzn-XLZ_hpJhSQTqR-YDsMuIA2CZaS5jm0FGOgdOdR_ANlhb-Rp64X6Pv3Lo-x_lb1cd_RkjyJ7N9B9cjg4LJXzOX0oGHjIIK079crEak7G-bxfsH5-Jm1rRJXBv0WzD3Op3wEUAgTEhcuhedokDjz93Mfh325Ari2AnKi2tzl93pUQ2",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuDpfDnnoxRLnX9Z1MXeB31XFJLClZI41FYwzdn-u_y0Ww2Ev95ew52gSrW-NhAWDTpIelfx0mkWYk-lOKC76TQ_Yl5AAticlNsmOGkO2OdV0Kh-z-Y74hbc1znxZToPSH3XCt1HygtlDUQ2kNXOYc0ryLAOn8fwVLJ52nXY0b2CJ-HiVeDfJR0ZOdhjE7tybzjnu5u0jwr9Y9wfYH94t0hzbi4csbL1Tys6EdK_fEDPyUMFk05DcBA68wqpV2va_6T-muRDCutb-9Id",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_ZYqirc6aOsriRZ6YZ2yYaIPt5W-uagipa9Zne5l-h7aNa7bgx0dJ92VCGr52PBxwUUMHBzi1xULXEZP1KE9hUBlFKBZei-q-4BoHTLGLAeCtW32UuBp1JLD1ZmCODEPgJqkE5THzj13inswULn-3KcG80OPcilxxP6FgMbukrYKFsniij3QVjXrXuNcAODcOWzde9RZzUM7I6RnJUtd0W_0gqqWgw_wJVBXfcZJalFr5fdTcAPofArgMYblGU3C2AvVOfjUYOnSr",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBY9TfYTQd55PQEfwQIQDHMpdNGa38-RkOQ4v8oncrb1lYcGrNdD8ULF9pD7L7KPS1U41Lb0ycDC7A29ojVs4XxiYRTJfkmfYXIlWbN7M0kc6rctXOCdiYbY8Fb3j5hTAkUinnWQomYHeHWOwaZy8n88gVaumAkfIuc5Ai9jD3tQ7KuJimPQkfJq64nQ1Hx2k4qxbzGwK8Rhi3bspthW28xGszBhXk8GSm4A3wYeUym2qq0uF4pJwKWc_MDqz9uK2grIYrSaiWle8Wy"
                  ],
                  amenities: ["Free WiFi", "Royal Dining", "Room Service", "Mountain View"],
                  about: "Perched beautifully near Fateh Sagar Lake against the dramatic backdrop of the Aravalli hills, this boutique heritage home combines traditional architecture with bespoke modern luxury. Rest in beautifully curated suites adorned with local Rajasthani art, vintage fabrics, and hand-carved stone pillars."
                },
                {
                  _id: "ud-3",
                  name: "Royal Aravali Resort & Spa",
                  city: "Udaipur",
                  address: "Sajjangarh Road, Udaipur, Rajasthan",
                  rating: 4.8,
                  reviewsCount: 290,
                  type: "Luxury Resorts",
                  pricePerNight: 14800,
                  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCs412SxoaVyKZxiFp-87VIFHY9BEQOwNl4OVpxf-kPCs5MhSRn-y1MgarWxt1ZFSTxGnBytuy1xwmQmbxUn3y5VOHuyA4MGT0SsA2oclMgcLaI3NezgkI0kntkGMEhSoRcFn3K-8ZkJeQvWpuUEUf882LBvaEm_IEffAf2X69mWXEsVkozmG2McSHqKfQqUaFUYgmIv3MNlo1OHIRp4Ncq_oOnQ86CcWBrTpGJDotX0Pd9zCBbzimTfF-ZztmcOht5evZsTk40GUng",
                  images: [
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuCs412SxoaVyKZxiFp-87VIFHY9BEQOwNl4OVpxf-kPCs5MhSRn-y1MgarWxt1ZFSTxGnBytuy1xwmQmbxUn3y5VOHuyA4MGT0SsA2oclMgcLaI3NezgkI0kntkGMEhSoRcFn3K-8ZkJeQvWpuUEUf882LBvaEm_IEffAf2X69mWXEsVkozmG2McSHqKfQqUaFUYgmIv3MNlo1OHIRp4Ncq_oOnQ86CcWBrTpGJDotX0Pd9zCBbzimTfF-ZztmcOht5evZsTk40GUng",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBY9TfYTQd55PQEfwQIQDHMpdNGa38-RkOQ4v8oncrb1lYcGrNdD8ULF9pD7L7KPS1U41Lb0ycDC7A29ojVs4XxiYRTJfkmfYXIlWbN7M0kc6rctXOCdiYbY8Fb3j5hTAkUinnWQomYHeHWOwaZy8n88gVaumAkfIuc5Ai9jD3tQ7KuJimPQkfJq64nQ1Hx2k4qxbzGwK8Rhi3bspthW28xGszBhXk8GSm4A3wYeUym2qq0uF4pJwKWc_MDqz9uK2grIYrSaiWle8Wy",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuDpfDnnoxRLnX9Z1MXeB31XFJLClZI41FYwzdn-u_y0Ww2Ev95ew52gSrW-NhAWDTpIelfx0mkWYk-lOKC76TQ_Yl5AAticlNsmOGkO2OdV0Kh-z-Y74hbc1znxZToPSH3XCt1HygtlDUQ2kNXOYc0ryLAOn8fwVLJ52nXY0b2CJ-HiVeDfJR0ZOdhjE7tybzjnu5u0jwr9Y9wfYH94t0hzbi4csbL1Tys6EdK_fEDPyUMFk05DcBA68wqpV2va_6T-muRDCutb-9Id",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_ZYqirc6aOsriRZ6YZ2yYaIPt5W-uagipa9Zne5l-h7aNa7bgx0dJ92VCGr52PBxwUUMHBzi1xULXEZP1KE9hUBlFKBZei-q-4BoHTLGLAeCtW32UuBp1JLD1ZmCODEPgJqkE5THzj13inswULn-3KcG80OPcilxxP6FgMbukrYKFsniij3QVjXrXuNcAODcOWzde9RZzUM7I6RnJUtd0W_0gqqWgw_wJVBXfcZJalFr5fdTcAPofArgMYblGU3C2AvVOfjUYOnSr"
                  ],
                  amenities: ["Swimming Pool", "Spa & Wellness", "Royal Dining", "Room Service"],
                  about: "Surround yourself with premium Mewari hospitality and wellness therapies on the edge of the Sajjangarh Wildlife Sanctuary. Rejuvenate with state-of-the-art spa programs, fine Indian specialty cuisine, and infinity-edge pools that frame the scenic hills and valleys of Southern Rajasthan."
                },
                {
                  _id: "jp-1",
                  name: "The Raj Palace Heritage",
                  city: "Jaipur",
                  address: "Amer Road, Pink City, Jaipur, Rajasthan",
                  rating: 4.9,
                  reviewsCount: 450,
                  type: "Heritage Stays",
                  pricePerNight: 24500,
                  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYnxXIKa_qwaAI8LEyjwDTt8BZ3oSoHOOoElVLtX2xHbfIT_U927oeD1l3uQEe9e_hsDjAbf7SGwS5jH40strZMYHuhXW15FSsXc5Ysq_FbAUDh3tSnuRuCPCuIMOZ62GHyFbyQdK-OwkSyGR9kcdM2aFSnhwvgoifQdRY38kjBNC1DkDo8TseMFMqi0ZJBuoykxbqcRGQmBvU7eO9UDjrBnVfpM8e8c9qDQlWmBEYr2xGExeOH-hPrR8C0biA8Pk3bjARZLS_P1sh",
                  images: [
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuDYnxXIKa_qwaAI8LEyjwDTt8BZ3oSoHOOoElVLtX2xHbfIT_U927oeD1l3uQEe9e_hsDjAbf7SGwS5jH40strZMYHuhXW15FSsXc5Ysq_FbAUDh3tSnuRuCPCuIMOZ62GHyFbyQdK-OwkSyGR9kcdM2aFSnhwvgoifQdRY38kjBNC1DkDo8TseMFMqi0ZJBuoykxbqcRGQmBvU7eO9UDjrBnVfpM8e8c9qDQlWmBEYr2xGExeOH-hPrR8C0biA8Pk3bjARZLS_P1sh",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_ZYqirc6aOsriRZ6YZ2yYaIPt5W-uagipa9Zne5l-h7aNa7bgx0dJ92VCGr52PBxwUUMHBzi1xULXEZP1KE9hUBlFKBZei-q-4BoHTLGLAeCtW32UuBp1JLD1ZmCODEPgJqkE5THzj13inswULn-3KcG80OPcilxxP6FgMbukrYKFsniij3QVjXrXuNcAODcOWzde9RZzUM7I6RnJUtd0W_0gqqWgw_wJVBXfcZJalFr5fdTcAPofArgMYblGU3C2AvVOfjUYOnSr",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBY9TfYTQd55PQEfwQIQDHMpdNGa38-RkOQ4v8oncrb1lYcGrNdD8ULF9pD7L7KPS1U41Lb0ycDC7A29ojVs4XxiYRTJfkmfYXIlWbN7M0kc6rctXOCdiYbY8Fb3j5hTAkUinnWQomYHeHWOwaZy8n88gVaumAkfIuc5Ai9jD3tQ7KuJimPQkfJq64nQ1Hx2k4qxbzGwK8Rhi3bspthW28xGszBhXk8GSm4A3wYeUym2qq0uF4pJwKWc_MDqz9uK2grIYrSaiWle8Wy",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuD9rmuOj5iWmWeJucgaxzlcgax4VI7caas8PUTwdrI0-5ZTw7s58TUoJzSGhS_bqTU5LGsUDGAqhGXYK5HIiueDAI4G_5uuI81won73xQzS8U_z71uBXFdd5UlzakF-wOUSm0WYwu7e9iZ_ApUf3PXvxiQjn0K3_RXVgQ_uooPylgorRlpotNVxF9co-b9NqRtzZSzgrAS8S0T_cM2JN0CVAQR_npC4jZoU-UdcFvCN6dViHPfbD6S6YXeC8WekWxx6qyylqDz_1tdw"
                  ],
                  amenities: ["Swimming Pool", "Free WiFi", "Breakfast Included"],
                  about: "Step inside this majestic retreat situated right adjacent to the royal Pink City. Indulge in classic Rajput elegance, private courtyard swings, rooftop views, and standard amenities that elevate your cultural stays into unforgettable heritage experiences."
                },
                {
                  _id: "jp-2",
                  name: "Jaipur Vista Palace",
                  city: "Jaipur",
                  address: "M.I. Road, Jaipur, Rajasthan",
                  rating: 4.6,
                  reviewsCount: 122,
                  type: "Boutique Hotels",
                  pricePerNight: 8500,
                  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6qhbu_vUUUm3xkc6ORX1nBBznbhkvsYq-XN_gmfsNuxP54YyFXCSg6FBRrLy-nR8ubt0YMvhZc9lwX-I1B0HYX1FAtEHg3KhU7HYYrHqnfryJ1vmUy4Fab2YnC2JstKgesh1YxSezdtGRq0yfaVzzg0Qrgt5urNbi7FrfqUaDGQTA39-hsMSJmwq2TEw9i9IxKRPFUb9xaeVjHJkuYhUkUQlNrWCXl0TcyvyAeRw9rXE-cOfFA10XzX4VuhLNyhXawY2qX75WdLjT",
                  images: [
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuC6qhbu_vUUUm3xkc6ORX1nBBznbhkvsYq-XN_gmfsNuxP54YyFXCSg6FBRrLy-nR8ubt0YMvhZc9lwX-I1B0HYX1FAtEHg3KhU7HYYrHqnfryJ1vmUy4Fab2YnC2JstKgesh1YxSezdtGRq0yfaVzzg0Qrgt5urNbi7FrfqUaDGQTA39-hsMSJmwq2TEw9i9IxKRPFUb9xaeVjHJkuYhUkUQlNrWCXl0TcyvyAeRw9rXE-cOfFA10XzX4VuhLNyhXawY2qX75WdLjT",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_ZYqirc6aOsriRZ6YZ2yYaIPt5W-uagipa9Zne5l-h7aNa7bgx0dJ92VCGr52PBxwUUMHBzi1xULXEZP1KE9hUBlFKBZei-q-4BoHTLGLAeCtW32UuBp1JLD1ZmCODEPgJqkE5THzj13inswULn-3KcG80OPcilxxP6FgMbukrYKFsniij3QVjXrXuNcAODcOWzde9RZzUM7I6RnJUtd0W_0gqqWgw_wJVBXfcZJalFr5fdTcAPofArgMYblGU3C2AvVOfjUYOnSr",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBY9TfYTQd55PQEfwQIQDHMpdNGa38-RkOQ4v8oncrb1lYcGrNdD8ULF9pD7L7KPS1U41Lb0ycDC7A29ojVs4XxiYRTJfkmfYXIlWbN7M0kc6rctXOCdiYbY8Fb3j5hTAkUinnWQomYHeHWOwaZy8n88gVaumAkfIuc5Ai9jD3tQ7KuJimPQkfJq64nQ1Hx2k4qxbzGwK8Rhi3bspthW28xGszBhXk8GSm4A3wYeUym2qq0uF4pJwKWc_MDqz9uK2grIYrSaiWle8Wy",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuDpfDnnoxRLnX9Z1MXeB31XFJLClZI41FYwzdn-u_y0Ww2Ev95ew52gSrW-NhAWDTpIelfx0mkWYk-lOKC76TQ_Yl5AAticlNsmOGkO2OdV0Kh-z-Y74hbc1znxZToPSH3XCt1HygtlDUQ2kNXOYc0ryLAOn8fwVLJ52nXY0b2CJ-HiVeDfJR0ZOdhjE7tybzjnu5u0jwr9Y9wfYH94t0hzbi4csbL1Tys6EdK_fEDPyUMFk05DcBA68wqpV2va_6T-muRDCutb-9Id"
                  ],
                  amenities: ["Free WiFi", "Breakfast Included"],
                  about: "Enjoy classic Rajasthani hospitality in the heart of M.I. Road. Features authentic local delicacies, modern luxury amenities, and standard room services designed for a delightful cultural vacation."
                },
                {
                  _id: "jd-1",
                  name: "Umaid Bhawan Desert Retreat",
                  city: "Jodhpur",
                  address: "Circuit House Road, Jodhpur, Rajasthan",
                  rating: 4.9,
                  reviewsCount: 512,
                  type: "Luxury Resorts",
                  pricePerNight: 29000,
                  image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBY9TfYTQd55PQEfwQIQDHMpdNGa38-RkOQ4v8oncrb1lYcGrNdD8ULF9pD7L7KPS1U41Lb0ycDC7A29ojVs4XxiYRTJfkmfYXIlWbN7M0kc6rctXOCdiYbY8Fb3j5hTAkUinnWQomYHeHWOwaZy8n88gVaumAkfIuc5Ai9jD3tQ7KuJimPQkfJq64nQ1Hx2k4qxbzGwK8Rhi3bspthW28xGszBhXk8GSm4A3wYeUym2qq0uF4pJwKWc_MDqz9uK2grIYrSaiWle8Wy",
                  images: [
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuBY9TfYTQd55PQEfwQIQDHMpdNGa38-RkOQ4v8oncrb1lYcGrNdD8ULF9pD7L7KPS1U41Lb0ycDC7A29ojVs4XxiYRTJfkmfYXIlWbN7M0kc6rctXOCdiYbY8Fb3j5hTAkUinnWQomYHeHWOwaZy8n88gVaumAkfIuc5Ai9jD3tQ7KuJimPQkfJq64nQ1Hx2k4qxbzGwK8Rhi3bspthW28xGszBhXk8GSm4A3wYeUym2qq0uF4pJwKWc_MDqz9uK2grIYrSaiWle8Wy",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuA_ZYqirc6aOsriRZ6YZ2yYaIPt5W-uagipa9Zne5l-h7aNa7bgx0dJ92VCGr52PBxwUUMHBzi1xULXEZP1KE9hUBlFKBZei-q-4BoHTLGLAeCtW32UuBp1JLD1ZmCODEPgJqkE5THzj13inswULn-3KcG80OPcilxxP6FgMbukrYKFsniij3QVjXrXuNcAODcOWzde9RZzUM7I6RnJUtd0W_0gqqWgw_wJVBXfcZJalFr5fdTcAPofArgMYblGU3C2AvVOfjUYOnSr",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuCs412SxoaVyKZxiFp-87VIFHY9BEQOwNl4OVpxf-kPCs5MhSRn-y1MgarWxt1ZFSTxGnBytuy1xwmQmbxUn3y5VOHuyA4MGT0SsA2oclMgcLaI3NezgkI0kntkGMEhSoRcFn3K-8ZkJeQvWpuUEUf882LBvaEm_IEffAf2X69mWXEsVkozmG2McSHqKfQqUaFUYgmIv3MNlo1OHIRp4Ncq_oOnQ86CcWBrTpGJDotX0Pd9zCBbzimTfF-ZztmcOht5evZsTk40GUng",
                      "https://lh3.googleusercontent.com/aida-public/AB6AXuD9rmuOj5iWmWeJucgaxzlcgax4VI7caas8PUTwdrI0-5ZTw7s58TUoJzSGhS_bqTU5LGsUDGAqhGXYK5HIiueDAI4G_5uuI81won73xQzS8U_z71uBXFdd5UlzakF-wOUSm0WYwu7e9iZ_ApUf3PXvxiQjn0K3_RXVgQ_uooPylgorRlpotNVxF9co-b9NqRtzZSzgrAS8S0T_cM2JN0CVAQR_npC4jZoU-UdcFvCN6dViHPfbD6S6YXeC8WekWxx6qyylqDz_1tdw"
                  ],
                  amenities: ["Swimming Pool", "Free WiFi", "Spa & Wellness", "Breakfast Included"],
                  about: "Rejuvenate with royal desert luxury therapies, butler service, and gorgeous panoramic sand-dune vistas of Jodhpur. Unwind under starry skies and explore historic forts with curated private guides."
                }
            ];

            const foundLuxury = luxuryMockRooms.find(r => r._id === id);
            if (foundLuxury) {
                setRoom({
                    ...foundLuxury,
                    hotel: {
                        name: foundLuxury.name,
                        city: foundLuxury.city,
                        address: foundLuxury.address
                    }
                });
                return;
            }

            // 2. Otherwise, check real database rooms via standard GET /api/rooms
            try {
                const { data } = await axios.get('/api/rooms');
                if (data.success) {
                    const dbRoom = data.rooms.find(r => r._id === id);
                    if (dbRoom) {
                        setRoom({
                            _id: dbRoom._id,
                            hotel: {
                                name: dbRoom.hotel?.name || "Premium Heritage Stay",
                                city: dbRoom.hotel?.city || "Udaipur",
                                address: dbRoom.hotel?.address || "Mewar Heritage Region",
                            },
                            roomType: dbRoom.roomType,
                            pricePerNight: dbRoom.pricePerNight,
                            images: dbRoom.images && dbRoom.images.length > 0 ? dbRoom.images : [
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuARK86bQhppCPH3GLs4FM9czrEDFWlrxPzwBkJ3BqQYMLUQl0gha4A8vliiWWj1xmXO6x6-L9_nqtVId3YGX-Do0csB_i4s7SNFfzADXK2N4EBR2QyWXeL_4YYM5kr9zTPNJE8j_zFoK-A_SiS57VfMKfdSayWBC_63wwQKZ1BKWE1Ldehh00G2e8bJ8AIbXwSzBGMaBqanZRGiwkwYRYvO2O6IuN_oOS44uD3UUadKXP6uycFqSd0QQs1bpPzqSDqQZ0h80lwQSjvI",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuA_ZYqirc6aOsriRZ6YZ2yYaIPt5W-uagipa9Zne5l-h7aNa7bgx0dJ92VCGr52PBxwUUMHBzi1xULXEZP1KE9hUBlFKBZei-q-4BoHTLGLAeCtW32UuBp1JLD1ZmCODEPgJqkE5THzj13inswULn-3KcG80OPcilxxP6FgMbukrYKFsniij3QVjXrXuNcAODcOWzde9RZzUM7I6RnJUtd0W_0gqqWgw_wJVBXfcZJalFr5fdTcAPofArgMYblGU3C2AvVOfjUYOnSr",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuBY9TfYTQd55PQEfwQIQDHMpdNGa38-RkOQ4v8oncrb1lYcGrNdD8ULF9pD7L7KPS1U41Lb0ycDC7A29ojVs4XxiYRTJfkmfYXIlWbN7M0kc6rctXOCdiYbY8Fb3j5hTAkUinnWQomYHeHWOwaZy8n88gVaumAkfIuc5Ai9jD3tQ7KuJimPQkfJq64nQ1Hx2k4qxbzGwK8Rhi3bspthW28xGszBhXk8GSm4A3wYeUym2qq0uF4pJwKWc_MDqz9uK2grIYrSaiWle8Wy",
                                "https://lh3.googleusercontent.com/aida-public/AB6AXuD9rmuOj5iWmWeJucgaxzlcgax4VI7caas8PUTwdrI0-5ZTw7s58TUoJzSGhS_bqTU5LGsUDGAqhGXYK5HIiueDAI4G_5uuI81won73xQzS8U_z71uBXFdd5UlzakF-wOUSm0WYwu7e9iZ_ApUf3PXvxiQjn0K3_RXVgQ_uooPylgorRlpotNVxF9co-b9NqRtzZSzgrAS8S0T_cM2JN0CVAQR_npC4jZoU-UdcFvCN6dViHPfbD6S6YXeC8WekWxx6qyylqDz_1tdw"
                            ],
                            amenities: dbRoom.amenities && dbRoom.amenities.length > 0 ? dbRoom.amenities : ["Swimming Pool", "Free WiFi", "Spa & Wellness", "Royal Dining"],
                            rating: 4.8,
                            reviewsCount: 24,
                            about: "Experience majestic views and authentic Indian heritage stays from this premium handpicked property. Specially curated to offer you unparalleled traditional hospitality and comfort."
                        });
                        return;
                    }
                }
            } catch (err) {
                console.error("DB Room Details Fetch Error:", err.message);
            }

            // 3. Fallback to base QuickStay Dummy Data rooms
            const foundBase = roomsDummyData.find(r => r._id === id);
            if (foundBase) {
                const dummyIdx = roomsDummyData.indexOf(foundBase);
                const prop = stitchProperties[dummyIdx % stitchProperties.length];
                setRoom({
                    ...foundBase,
                    hotel: {
                        ...foundBase.hotel,
                        name: prop.name,
                        city: prop.city,
                        address: prop.address
                    },
                    pricePerNight: prop.price,
                    images: prop.images,
                    amenities: prop.amenities,
                    rating: prop.rating,
                    reviewsCount: prop.reviewsCount,
                    about: prop.about
                });
            }
        };

        fetchRoomData();
    }, [id, stitchProperties, axios]);

    // Mock data for similar rooms to show under "Choose Your Room"
    const otherRooms = useMemo(() => [
        {
            _id: "heritage-suite",
            name: "Heritage Suite",
            desc: "450 sq ft • City View • Balcony",
            price: 12500,
            badge: "Rare Find",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA_ZYqirc6aOsriRZ6YZ2yYaIPt5W-uagipa9Zne5l-h7aNa7bgx0dJ92VCGr52PBxwUUMHBzi1xULXEZP1KE9hUBlFKBZei-q-4BoHTLGLAeCtW32UuBp1JLD1ZmCODEPgJqkE5THzj13inswULn-3KcG80OPcilxxP6FgMbukrYKFsniij3QVjXrXuNcAODcOWzde9RZzUM7I6RnJUtd0W_0gqqWgw_wJVBXfcZJalFr5fdTcAPofArgMYblGU3C2AvVOfjUYOnSr"
        },
        {
            _id: "royal-palace-suite",
            name: "Royal Palace Suite",
            desc: "650 sq ft • Lake View • Terrace",
            price: 24500,
            badge: "Guest Favorite",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBY9TfYTQd55PQEfwQIQDHMpdNGa38-RkOQ4v8oncrb1lYcGrNdD8ULF9pD7L7KPS1U41Lb0ycDC7A29ojVs4XxiYRTJfkmfYXIlWbN7M0kc6rctXOCdiYbY8Fb3j5hTAkUinnWQomYHeHWOwaZy8n88gVaumAkfIuc5Ai9jD3tQ7KuJimPQkfJq64nQ1Hx2k4qxbzGwK8Rhi3bspthW28xGszBhXk8GSm4A3wYeUym2qq0uF4pJwKWc_MDqz9uK2grIYrSaiWle8Wy"
        }
    ], []);

    // Mock curated local experiences
    const experiences = [
        {
            title: "Pink City Sunrise Balloon Safari",
            type: "Guided tour • 3 hours",
            price: "8,500",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYnxXIKa_qwaAI8LEyjwDTt8BZ3oSoHOOoElVLtX2xHbfIT_U927oeD1l3uQEe9e_hsDjAbf7SGwS5jH40strZMYHuhXW15FSsXc5Ysq_FbAUDh3tSnuRuCPCuIMOZ62GHyFbyQdK-OwkSyGR9kcdM2aFSnhwvgoifQdRY38kjBNC1DkDo8TseMFMqi0ZJBuoykxbqcRGQmBvU7eO9UDjrBnVfpM8e8c9qDQlWmBEYr2xGExeOH-hPrR8C0biA8Pk3bjARZLS_P1sh",
            featured: true
        },
        {
            title: "Traditional Rajasthani Culinary Class",
            type: "Workshop • 4 hours",
            price: "3,200",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD87j4lxnW2IPH7lWc97Os3jIkweuUIUlbfHlXh5NJk8OeAheeh6k9mNaIfDSbLnn0FsrzU6ktptD0Yby9x4vShOy2eOA32PM46moW5XH1HqkyBcGqOD_b8zAK20f6PrmaPyFqBMQh-lpa26kiXV4VuffW2i6CC-cf6N0GRsqzanuieAwGBT85kgr03AdcTteGAVkh_aNdpGCwvnFz1CuS5CQtprPTxWaZyd0uhws7uNk0rh2j5H-4MTXSWXeKvdYyUz505Uu08hjoQ",
            featured: false
        },
        {
            title: "Night Photography at Amber Fort",
            type: "Night tour • 2.5 hours",
            price: "5,000",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuC6qhbu_vUUUm3xkc6ORX1nBBznbhkvsYq-XN_gmfsNuxP54YyFXCSg6FBRrLy-nR8ubt0YMvhZc9lwX-I1B0HYX1FAtEHg3KhU7HYYrHqnfryJ1vmUy4Fab2YnC2JstKgesh1YxSezdtGRq0yfaVzzg0Qrgt5urNbi7FrfqUaDGQTA39-hsMSJmwq2TEw9i9IxKRPFUb9xaeVjHJkuYhUkUQlNrWCXl0TcyvyAeRw9rXE-cOfFA10XzX4VuhLNyhXawY2qX75WdLjT",
            featured: false
        }
    ];

    const handleBooking = async () => {
        try {
            const token = await getToken()
            if (!token) {
                toast.error("Please sign in to book your heritage stay.")
                return
            }

            const checkIn = new Date(bookingDate.checkIn)
            const checkOut = new Date(bookingDate.checkOut)
            const timeDiff = checkOut.getTime() - checkIn.getTime();
            const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
            const calculatedNights = nights > 0 ? nights : 3;

            navigate('/payment', {
                state: {
                    room,
                    bookingDate,
                    basePrice,
                    serviceFee,
                    taxes,
                    totalPrice: (basePrice * calculatedNights) + serviceFee + taxes,
                    totalNights: calculatedNights
                }
            })
        } catch (error) {
            toast.error(error.message)
        }
    }

    if (!room) return <div className="py-20 text-center font-montserrat">Loading...</div>;

    const basePrice = room.pricePerNight;
    const serviceFee = 1250;
    const taxes = 4500;
    
    // Dynamic nights calculation
    const checkIn = new Date(bookingDate.checkIn)
    const checkOut = new Date(bookingDate.checkOut)
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    const totalNights = nights > 0 ? nights : 3;

    const totalPrice = (basePrice * totalNights) + serviceFee + taxes;

    return (
        <main className="jali-overlay min-h-screen pb-20 bg-background">
            
            {/* Header info bar */}
            <div className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 pt-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4 text-left">
                    <div>
                        <h1 className="font-montserrat text-3xl font-extrabold text-primary">{room.hotel.name}</h1>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                            <div className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-secondary-container text-sm font-fill" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                <span className="material-symbols-outlined text-secondary-container text-sm font-fill" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                <span className="material-symbols-outlined text-secondary-container text-sm font-fill" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                <span className="material-symbols-outlined text-secondary-container text-sm font-fill" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                                <span className="material-symbols-outlined text-secondary-container text-sm font-fill" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
                            </div>
                            <span className="font-inter text-xs text-gray-500 font-bold ml-1">
                                {room.rating} ({room.reviewsCount} Reviews) • {room.hotel.address}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 bg-white rounded-xl hover:bg-slate-50 transition-premium shadow-sm text-xs font-bold font-montserrat text-primary cursor-pointer active:scale-95">
                            <span className="material-symbols-outlined text-sm">share</span>
                            Share
                        </button>
                        <button className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 bg-white rounded-xl hover:bg-slate-50 transition-premium shadow-sm text-xs font-bold font-montserrat text-primary cursor-pointer active:scale-95">
                            <span className="material-symbols-outlined text-sm">favorite</span>
                            Save
                        </button>
                    </div>
                </div>

                {/* Bento Gallery layout */}
                <div className="grid grid-cols-4 grid-rows-2 gap-3 h-[480px] rounded-3xl overflow-hidden custom-shadow bg-white border border-gray-100 p-2">
                    {/* Large primary image */}
                    <div className="col-span-2 row-span-2 relative group overflow-hidden rounded-2xl cursor-pointer">
                        <img 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            src={room.images[0]} 
                            alt={room.hotel.name} 
                        />
                    </div>
                    {/* Small stacked image 1 */}
                    <div className="col-span-1 row-span-1 relative group overflow-hidden rounded-2xl cursor-pointer">
                        <img 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            src={room.images[1]} 
                            alt={room.hotel.name} 
                        />
                    </div>
                    {/* Small stacked image 2 */}
                    <div className="col-span-1 row-span-1 relative group overflow-hidden rounded-2xl cursor-pointer">
                        <img 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            src={room.images[2]} 
                            alt={room.hotel.name} 
                        />
                    </div>
                    {/* Medium bottom image */}
                    <div className="col-span-2 row-span-1 relative group overflow-hidden rounded-2xl cursor-pointer">
                        <img 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            src={room.images[3] || room.images[0]} 
                            alt={room.hotel.name} 
                        />
                        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl font-montserrat font-bold text-xs text-primary shadow-sm flex items-center gap-1.5 cursor-pointer hover:bg-white transition-all">
                            <span className="material-symbols-outlined text-sm">grid_view</span>
                            View all 48 photos
                        </div>
                    </div>
                </div>

            </div>

            {/* Content section */}
            <section className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-12 flex flex-col lg:flex-row gap-8 items-start">
                
                {/* Left block: Spec description */}
                <div className="w-full lg:w-5/12 space-y-8 text-left">
                    <div>
                        <h2 className="font-montserrat text-2xl font-extrabold text-primary mb-4">About this Heritage Gem</h2>
                        <p className="font-inter text-gray-500 leading-relaxed text-sm">
                            {room.about}
                        </p>
                        <button className="mt-3 text-primary font-bold hover:underline flex items-center gap-1 transition-all text-sm">
                            Show more <span className="material-symbols-outlined text-sm">chevron_right</span>
                        </button>
                    </div>

                    <div className="border-t border-gray-200/60 pt-8">
                        <h3 className="font-montserrat text-lg font-bold text-primary mb-4">Premium Amenities</h3>
                        <div className="grid grid-cols-2 gap-4">
                            {room.amenities.map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <span className="material-symbols-outlined text-primary p-2 bg-primary/5 rounded-full text-base font-bold">
                                        {item.includes("Pool") ? "pool" : item.includes("WiFi") ? "wifi" : item.includes("Spa") ? "spa" : "restaurant"}
                                    </span>
                                    <span className="font-inter text-sm font-semibold text-gray-600 uppercase tracking-wide text-[11px]">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Middle block: Choose Your Room */}
                <div className="w-full lg:w-4/12 space-y-6 text-left">
                    <h2 className="font-montserrat text-2xl font-extrabold text-primary">Choose Your Room</h2>
                    <div className="space-y-6">
                        {otherRooms.map((r) => (
                            <div 
                                key={r._id} 
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 hover:border-secondary transition-premium cursor-pointer"
                            >
                                <div className="h-40 overflow-hidden">
                                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src={r.image} alt={r.name} />
                                </div>
                                <div className="p-5 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-montserrat text-base font-bold text-primary">{r.name}</h3>
                                        <span className="bg-secondary-fixed text-on-secondary-fixed text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">{r.badge}</span>
                                    </div>
                                    <p className="font-inter text-xs text-gray-400">{r.desc}</p>
                                    <div className="flex justify-between items-end pt-2">
                                        <div>
                                            <span className="font-montserrat text-base font-bold text-primary">{currency}{r.price.toLocaleString()}</span>
                                            <span className="font-inter text-[10px] text-gray-400">/night</span>
                                        </div>
                                        <button className="text-secondary font-bold text-xs uppercase tracking-widest font-montserrat hover:text-secondary-dark">Details</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right block: Sticky reservation widget */}
                <div className="w-full lg:w-3/12">
                    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md sticky top-24 space-y-6 text-left">
                        <div className="flex justify-between items-end border-b border-gray-100 pb-3">
                            <span className="font-montserrat text-2xl font-extrabold text-primary">{currency}{basePrice.toLocaleString()}</span>
                            <span className="font-inter text-xs text-gray-400 mb-1">per night</span>
                        </div>

                        {/* Date selection simulator */}
                        <div className="grid grid-cols-2 border border-gray-200 rounded-xl overflow-hidden">
                            <div className="p-3 border-r border-gray-200 bg-slate-50/40 hover:bg-slate-50 transition-colors cursor-pointer">
                                <span className="text-[9px] font-bold uppercase text-gray-400 block">Check-in</span>
                                <input 
                                    type="date"
                                    value={bookingDate.checkIn}
                                    onChange={(e) => setBookingDate(prev => ({...prev, checkIn: e.target.value}))}
                                    className="font-inter text-xs font-semibold text-gray-700 bg-transparent border-none p-0 outline-none w-full"
                                />
                            </div>
                            <div className="p-3 bg-slate-50/40 hover:bg-slate-50 transition-colors cursor-pointer">
                                <span className="text-[9px] font-bold uppercase text-gray-400 block">Check-out</span>
                                <input 
                                    type="date"
                                    value={bookingDate.checkOut}
                                    onChange={(e) => setBookingDate(prev => ({...prev, checkOut: e.target.value}))}
                                    className="font-inter text-xs font-semibold text-gray-700 bg-transparent border-none p-0 outline-none w-full"
                                />
                            </div>
                            <div className="col-span-2 p-3 border-t border-gray-200 bg-slate-50/40 hover:bg-slate-50 transition-colors cursor-pointer flex justify-between items-center">
                                <div className="w-full">
                                    <span className="text-[9px] font-bold uppercase text-gray-400 block">Guests</span>
                                    <input 
                                        type="number"
                                        min={1}
                                        max={10}
                                        value={bookingDate.guests}
                                        onChange={(e) => setBookingDate(prev => ({...prev, guests: Number(e.target.value)}))}
                                        className="font-inter text-xs font-semibold text-gray-700 bg-transparent border-none p-0 outline-none w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Fee breakups */}
                        <div className="space-y-3 font-inter text-sm text-gray-500">
                            <div className="flex justify-between">
                                <span>{currency}{basePrice.toLocaleString()} x {totalNights} nights</span>
                                <span>{currency}{(basePrice * totalNights).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between underline decoration-dotted decoration-gray-300">
                                <span>BharatStay Service Fee</span>
                                <span>{currency}{serviceFee.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between underline decoration-dotted decoration-gray-300">
                                <span>Taxes</span>
                                <span>{currency}{taxes.toLocaleString()}</span>
                            </div>
                            <hr className="border-gray-100" />
                            <div className="flex justify-between font-montserrat font-bold text-lg text-primary">
                                <span>Total</span>
                                <span>{currency}{totalPrice.toLocaleString()}</span>
                            </div>
                        </div>

                        <button 
                            onClick={handleBooking}
                            className="w-full bg-secondary-container hover:bg-secondary text-on-secondary-container hover:text-white py-4 rounded-xl font-montserrat font-bold hover:shadow-lg transition-premium cursor-pointer text-sm tracking-wider uppercase active:scale-95"
                        >
                            Book Now
                        </button>
                        <p className="text-center text-[10px] text-gray-400 font-inter">You won't be charged yet</p>
                    </div>
                </div>

            </section>

            {/* Bottom experiences block */}
            <section className="max-w-6xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 py-16 bg-slate-50 border-t border-gray-200/50 rounded-3xl mt-12">
                <div className="flex justify-between items-end mb-8 text-left">
                    <div>
                        <h2 className="font-montserrat text-2xl font-extrabold text-primary mb-1">Curated Local Experiences</h2>
                        <p className="font-inter text-sm text-gray-400">Handpicked adventures near your stay</p>
                    </div>
                    <button className="text-primary font-bold text-xs uppercase tracking-widest font-montserrat hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none">
                        View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {experiences.map((exp, index) => (
                        <div key={index} className="group cursor-pointer text-left flex flex-col active:scale-[0.99]">
                            <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-4 relative shadow-sm border border-gray-100">
                                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={exp.image} alt={exp.title} />
                                {exp.featured && (
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-xl text-[10px] font-bold text-primary shadow-sm uppercase tracking-wide">
                                        Featured
                                    </div>
                                )}
                            </div>
                            <h3 className="font-montserrat text-base font-bold text-primary group-hover:text-secondary transition-colors line-clamp-1">{exp.title}</h3>
                            <p className="font-inter text-xs text-gray-400 mt-1 mb-2">{exp.type}</p>
                            <p className="font-montserrat text-sm font-bold text-primary">
                                ₹{exp.price} <span className="font-inter text-xs text-gray-400 font-normal">/ person</span>
                            </p>
                        </div>
                    ))}
                </div>
            </section>

        </main>
    )
}

export default RoomDetails
