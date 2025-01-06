import {Badge, Box, Flex, Heading, Spinner, Text, VStack,} from "@chakra-ui/react";
import React, {useEffect, useState} from "react";
import LinkButton from '../components/LinkButton';
import {MessageSquareMore} from 'lucide-react';
import {FaRegCheckCircle} from "react-icons/fa";
import {useNavigate, useParams} from "react-router-dom";
import client from "../services/axios.ts";
import {TbCategory} from "react-icons/tb";
import {LuHourglass} from "react-icons/lu";
import {IoBookOutline} from "react-icons/io5";
import {MenuContent, MenuItem, MenuRoot, MenuTrigger} from "../components/ui/menu.tsx";
import {Button} from "../components/ui/button.tsx";
import {HiOutlineDotsVertical} from "react-icons/hi";
import {toaster} from "../components/ui/toaster.tsx";
import {toggleConfetti} from "../services/redux/slices/confettiSlice.ts";
import {useAppDispatch} from "../services/redux/store.ts";
import {useAuth} from "../services/auth/AuthContext.tsx";
import {MdNewReleases} from "react-icons/md";
import {Rating} from "../components/ui/rating.tsx";

interface Video {
    id: string;
    title: string;
    url: string;
}

export interface Course {
    id: number;
    name: string;
    description: string;
    category: string;
    duration: string;
    level: string;
    rating: number;
    creationDate: string;
    additionalResources: Video[];
}

const Course: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [_, setIsLoading] = useState<boolean>(false);

    const {reloadStudent} = useAuth();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await client.get<Course>(`/api/v1/courses/${id}`);
                setCourse(response.data);
            } catch (error) {
                console.error("Error fetching course:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (loading) {
        return (
            <Flex alignItems="center" justifyContent="center" height="100vh">
                <Spinner size="xl"/>
            </Flex>
        );
    }

    if (!course) {
        return (
            <Flex alignItems="center" justifyContent="center" height="100vh">
                <Text>Course not found</Text>
            </Flex>
        );
    }

    const handleCompleteCourse = async () => {
        try {
            await client.post(`/api/v1/students/me/courses/${id}/complete`);
            toaster.create({
                title: "Successfully completed course!",
                type: "success",
            });
            dispatch(toggleConfetti());
            setIsLoading(true);
            await reloadStudent();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (_) {
            toaster.create({
                title: "Error completing course!",
                type: "error",
            });
        } finally {
            setTimeout(() => dispatch(toggleConfetti()), 5000);
        }
    }

    return (
        <Box p={4}>
            <Flex direction={{base: 'column', md: 'row'}} gap={4}>
                <Box overflow="hidden" position="relative" flex="1" p={4} bg="white" boxShadow="md" borderRadius="md">
                    <MenuRoot positioning={{placement: "bottom-start"}}>
                        <MenuTrigger asChild>
                            <Button _hover={{color: "gray"}}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center"
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                    unstyled height={10}
                                    width={10} cursor="pointer" position="absolute" right={3}
                                    top={3}>
                                <HiOutlineDotsVertical size={22}/>
                            </Button>
                        </MenuTrigger>
                        <MenuContent>
                            <MenuItem onClick={async (e) => {
                                e.stopPropagation();
                                await handleCompleteCourse();
                            }}
                                      cursor="pointer"
                                      color="green.500"
                                      value="complete"
                                      valueText="complete">
                                <FaRegCheckCircle/>
                                <Box flex="1">Complete Course</Box>
                            </MenuItem>
                        </MenuContent>
                    </MenuRoot>

                    <Flex position="relative" height="full" direction="column" justifyContent="space-between">
                        <Flex direction="column">
                            <Heading fontSize="2xl" mb={4}>{course.name}</Heading>
                            <Flex direction="row" gap={4} flexWrap="wrap">
                                <Badge colorPalette="teal">
                                    <TbCategory/>
                                    {course.category}
                                </Badge>
                                <Badge colorPalette="blue">
                                    <LuHourglass/>
                                    {course.duration}
                                </Badge>
                                <Badge colorPalette="purple">
                                    <IoBookOutline/>
                                    {course.level}
                                </Badge>
                            </Flex>
                            <Flex mt={2} gap={1} alignItems="center">
                                <MdNewReleases size={20}/>
                                <Text fontSize="md">
                                    Created on {new Date(course.creationDate).toLocaleDateString()}
                                </Text>
                            </Flex>

                            <Flex mt={2} gap={1} alignItems="center" cursor="pointer">
                                <Flex direction="row" gap={1}>
                                    <Text fontWeight="bold" fontSize="md">{course.rating | 0},0</Text>
                                    <Rating colorPalette="orange" value={course.rating | 0} defaultValue={0}
                                            size="sm"/>
                                    <Button unstyled onClick={() => navigate(`/courses/${id}/ratings`)}>
                                        <Text _hover={{textDecoration: "underline", cursor: "pointer"}} fontWeight="md"
                                              color="gray" fontSize="md">add review</Text>
                                    </Button>
                                </Flex>
                            </Flex>
                            <Text mt={4} mb={4} fontSize="lg" color="gray.700">{course.description}</Text>
                        </Flex>

                        <Box border={1} left={-4} bottom={-5} p={5} mt={6}>
                            <Flex alignItems="center" gap={1} justifyContent="space-between">
                                <Text fontWeight="bold">Want to join the Community?</Text>
                                <LinkButton colorScheme="teal" variant="solid" to={`/forums/${id}`}>
                                    Join
                                    <MessageSquareMore/>
                                </LinkButton>
                            </Flex>
                        </Box>
                    </Flex>
                </Box>
                <Box flex="1" p={4} bg="white" boxShadow="md" borderRadius="md" maxHeight="80vh" overflowY="auto">
                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                        List of Course Videos
                    </Text>
                    <VStack align="start" gap={2} width="100%">
                        {course.additionalResources.map((video) => (
                            <Box key={video.url} width="100%">
                                <Text fontWeight="bold" mb={2}>
                                    {video.title}
                                </Text>
                                <iframe
                                    width="100%"
                                    height="315"
                                    src={`https://www.youtube.com/embed/${video.url}`}
                                    title={video.title}
                                    style={{border: "none"}}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </Box>
                        ))}
                    </VStack>
                </Box>
            </Flex>
        </Box>
    );
};

export default Course;
