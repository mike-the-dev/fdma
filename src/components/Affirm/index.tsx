"use client";
import React from "react";
import { Button, Card, Input, Spacer } from "@nextui-org/react";
import Image from 'next/image';
import twitterIcon from "../../public/images/twitter-icon.svg";

const Affirm = (): React.ReactElement => {
  var _affirm_config = {
    public_api_key: "KQ83CYWR82EARLEG", /* replace with public api key */
    script: "https://cdn1-sandbox.affirm.com/js/v2/affirm.js",
    // script: "https://sandbox.affirm.com/js/v2/affirm.js",
    locale: "en_US",
    country_code: "USA",
  };

  const onClickHandler = () => {
    // @ts-ignore
    affirm.checkout({
      "merchant": {
        // "user_confirmation_url": "https://merchantsite.com/confirm",
        // "user_cancel_url": "https://merchantsite.com/cancel",
        "user_confirmation_url": "https://merchantsite.com/confirm",
        "user_cancel_url": "https://google.com",
        "public_api_key": "KQ83CYWR82EARLEG",
        "user_confirmation_url_action": "POST",
        "name": "Your Customer-Facing Merchant Name"
      },
      "shipping": {
        "name": {
          "first": "Joe",
          "last": "Doe"
        },
        "address": {
          "line1": "633 Folsom St",
          "line2": "Floor 7",
          "city": "San Francisco",
          "state": "CA",
          "zipcode": "94107",
          "country": "USA"
        },
        "phone_number": "4153334567",
        "email": "joedoe@123fakestreet.com"
      },
      "billing": {
        "name": {
          "first": "Joe",
          "last": "Doe"
        },
        "address": {
          "line1": "633 Folsom St",
          "line2": "Floor 7",
          "city": "San Francisco",
          "state": "CA",
          "zipcode": "94107",
          "country": "USA"
        },
        "phone_number": "4153334567",
        "email": "joedoe@123fakestreet.com"
      },
      "items": [{
        "display_name": "Awesome Pants",
        "sku": "ABC-123",
        "unit_price": 10000,
        "qty": 3,
        "item_image_url": "http://merchantsite.com/images/awesome-pants.jpg",
        "item_url": "http://merchantsite.com/products/awesome-pants.html",
        "categories": [
          ["Home", "Bedroom"],
          ["Home", "Furniture", "Bed"]
        ]
      }
      ],
      "discounts": {
        "RETURN5": {
          "discount_amount": 500,
          "discount_display_name": "Returning customer 5% discount"
        },
        "PRESDAY10": {
          "discount_amount": 1000,
          "discount_display_name": "President's Day 10% off"
        }
      },
      "metadata": {
        "shipping_type": "UPS Ground",
        "mode": "modal"
      },
      "order_id": "JKLMO4321",
      "currency": "USD",
      "financing_program": "flyus_3z6r12r",
      "shipping_amount": 1000,
      "tax_amount": 600,
      "total": 30100
    });
    // @ts-ignore
    affirm.checkout.open(); 
  };

  React.useEffect(() => {
    (function (m, g, n, d, a, e, h, c) {
      // @ts-ignore
      var b = m[n] || {}, k = document.createElement(e), p = document.getElementsByTagName(e)[0], l = function (a, b, c) { return function () { a[b]._.push([c, arguments]) } }; b[d] = l(b, d, "set"); var f = b[d]; b[a] = {}; b[a]._ = []; f._ = []; b._ = []; b[a][h] = l(b, a, h); b[c] = function () { b._.push([h, arguments]) }; a = 0; for (c = "set add save post open empty reset on off trigger ready setProduct".split(" "); a < c.length; a++)f[c[a]] = l(b, d, c[a]); a = 0; for (c = ["get", "token", "url", "items"]; a < c.length; a++)f[c[a]] = function () { }; k.async =
      // @ts-ignore
        !0; k.src = g[e]; p.parentNode.insertBefore(k, p); delete g[e]; f(g); m[n] = b
    })(window, _affirm_config, "affirm", "checkout", "ui", "script", "ready", "jsReady");
  }, []);

  return (
    <Card
      isBlurred
      className="border-none bg-background/60 dark:bg-default-100/50 max-w-[810px]"
      shadow="sm"
      style={{ padding: "12px 12px 12px 12px", width: "100%", margin: "0 auto" }}
    >
      <h1>Affirm Intergration</h1>
      <Spacer y={2} />
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Input type="text" label="First" name={"First"} /> 
        <Input type="text" label="Last" name={"Last"} /> 
      </div>
      <Spacer y={4} />
      <Input type="text" label="Line 1" name={"Last"} /> 
      <Spacer y={4} />
      <Input type="text" label="Line 2" name={"Last"} /> 
      <Spacer y={4}/>
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Input type="text" label="City" name={"City"} /> 
        <Input type="text" label="State" name={"State"} />
        <Input type="text" label="Zipcode" name={"Zipcode"} /> 
      </div>
      <Spacer y={4} />
      <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
        <Input type="text" label="Country" name={"Country"} /> 
        <Input type="text" label="Phone" name={"Phone"} /> 
        <Input type="text" label="Email" name={"Email"} /> 
      </div>
      <Spacer y={4} />
      <span style={{ color: "#FFF" }}>Pay with</span>
      <Spacer y={2} />
      <Button 
      color="primary" 
      variant="bordered" 
      onPress={onClickHandler}
      className="max-w-[240px]"
      style={{ height: 50 }}
      >
        <Image
          priority
          src="/affirm_logo_black.svg"
          height={72}
          width={72}
          alt="Follow us on Twitter"
        />
      </Button>
      <Spacer y={4} />
    </Card>
  );
};

export default Affirm;