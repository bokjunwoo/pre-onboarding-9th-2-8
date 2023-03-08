import { useEffect, useState } from 'react';
import {
  Heading,
  VStack,
  RangeSlider,
  RangeSliderTrack,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  Tag,
  Stack,
} from '@chakra-ui/react';
import { getProducts } from '@/store/slices/productSlice';
import Product from '@/components/Product';
import { IProduct } from '@/interface/product';
import { RootState, useAppDispatch, useAppSelector } from '@/store';
import {
  generateBoolMappedObj,
  getMaxPrice,
} from '@/lib/utils/productsHelpers';

const ProductList = () => {
  const dispatch = useAppDispatch();
  const {
    products: { products },
  } = useAppSelector((state: RootState) => state);

  const [defaultValues, setDefaultValues] = useState<number[]>([]);
  const [currentValues, setCurrentValues] = useState<number[]>([]);
  const [spaceHashMap, setSpaceHashMap] = useState<{ [key: string]: boolean }>(
    {},
  );

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  useEffect(() => {
    setDefaultValues([0, getMaxPrice(products)]);
    setSpaceHashMap(generateBoolMappedObj(products, true));
  }, [products]);

  useEffect(() => {
    setCurrentValues(defaultValues);
  }, [defaultValues]);

  const onSlidePrice = (event: number[]) => {
    setCurrentValues(
      event.map((value) =>
        Math.floor((value / 100) * defaultValues[1] + defaultValues[0]),
      ),
    );
  };

  const onToggleSpace = (key: string) => {
    setSpaceHashMap({
      ...spaceHashMap,
      [key]: !spaceHashMap[key],
    });
  };

  const filteredProducts = products.filter((product: IProduct) => {
    const [currentMin, currentMax] = currentValues;

    return (
      product.price >= currentMin &&
      product.price <= currentMax &&
      spaceHashMap[product.spaceCategory]
    );
  });

  return (
    <VStack as="section" bg="blue.100" w="75%" minW="500px" p={4}>
      <Heading>상품 정보</Heading>
      {defaultValues[1] > 0 && (
        <>
          <RangeSlider defaultValue={[0, 100]} onChange={onSlidePrice}>
            <RangeSliderTrack>
              <RangeSliderFilledTrack />
            </RangeSliderTrack>
            <RangeSliderThumb index={0} />
            <RangeSliderThumb index={1} />
          </RangeSlider>
          {currentValues[0]} {currentValues[1]}
        </>
      )}

      <Stack direction="row">
        {Object.keys(spaceHashMap).map((spaceKey) => {
          return (
            <Tag
              key={spaceKey}
              variant={spaceHashMap[spaceKey] ? 'solid' : 'outline'}
              colorScheme="blue"
              onClick={() => onToggleSpace(spaceKey)}
            >
              {spaceKey}
            </Tag>
          );
        })}
      </Stack>

      {filteredProducts.map((product: IProduct) => (
        <Product key={product.idx} {...product} />
      ))}
    </VStack>
  );
};
export default ProductList;
